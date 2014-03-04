from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger
from collections import namedtuple

import os
import glob
import re
import json
import locking
import arrow
import shortuuid

from couchbase import Couchbase
from couchbase.exceptions import CouchbaseError
from couchbase.exceptions import KeyExistsError, NotFoundError
from couchbase.views.iterator import RowProcessor
from couchbase.views.params import UNSPEC, Query

from processingexceptions import *


DOCUMENTTYPEKEYFORMAT = "{0}|{1}"
DATABASENAME = "default"

feedtype = None
rowkeyschema = {}
rowschema = {}

app = Celery('processfiles')
app.config_from_object("celeryconfig")
logger = get_task_logger(__name__)

masterTenantid = 0
DocumentType = "FEEDCONFIG"



class DatabaseTask(Task):
	abstract = True
	_db = None
	_MasterFeedDefinitions = {}

	@property
	def cb(self):
		if self._db is None:
			self._db = Couchbase.connect(bucket=DATABASENAME)
		return self._db

	@property
	def MasterFeedDefinitions(self):
		if self._db is None:
			self._db = Couchbase.connect(bucket=DATABASENAME)
			_MasterFeedDefinitions = self._db.get(DOCUMENTTYPEKEYFORMAT.format(masterTenantid, documentType)).value
		return _MasterFeedDefinitions

@app.task(base=DatabaseTask)
def startProcess(tenantid, documentType):
	path = "feeds/"
	DocumentType = documentType
	cbDocument = startProcess.cb.get(DOCUMENTTYPEKEYFORMAT.format(tenantid, documentType)).value
	if ( cbDocument ):
		
		for infile in glob.glob( os.path.join(path, '*.txt') ):
			logger.info("Processing file : %s" % infile)
			logger.debug("Acquiring lock for file : %s" % infile)
			filelock = locking.acquire_lockr(infile, block=1)
			logger.debug("Acquired lock for file : %s" % infile)
			locking.release_lock(filelock)
			logger.debug("Releasing lock for file : %s" % infile)
			
			with open(infile, 'r') as content_file:
				content = content_file.read()

			lines = content.splitlines()
			firstline = lines[0]
			lastline = lines[len(lines)-1]
			
			trlRowCount = int(lastline.split("|")[1])
			if ( trlRowCount == (len(lines) - 2) ):
				if (trlRowCount > 0):
					for k, v in cbDocument["CONFIGS"].items():
						if infile.find(k) > 0:
							feedtype = k
							rowkeyschema = v['rowkeyschema']
							rowschema = v['rowschema']
							
							for lineno, line in enumerate(lines):
								if line.startswith('HDR'):
									pass
								elif line.startswith('TRL'):
									pass
								else:
									try:
										insertLine(infile, tenantid, feedtype, rowkeyschema, rowschema, lineno, line)
										logger.debug (line)
									except (RowSchemaLessMismatchException, RowSchemaMoreMismatchException) as eSchemaEx:
										logger.debug (eSchemaEx)
									except (RowDuplicateException) as eEx:
										logger.debug (eEx)
									except (Exception) as ex:
										logger.debug (ex)
									# linelist = cb.get(linevalues['dictline']).value
									# linelist
									#deleteLine(rowkeyschema, rowschema, 1, feedtype, infile, line)
									#insertLine(rowkeyschema, rowschema, 1, feedtype, infile, line)
									pass
					logger.info ("Successfully processed file : " + infile + " with " + str(trlRowCount) + " lines.")
				elif (trlRowCount == 0):
					logger.info ("Successfully processed file : " + infile + " with " + str(trlRowCount) + " line.")
			else:
				logger.info("Rowcount mismatch")
			
	
def lineToDictionary(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line):
	dictline = {}
	dictline['updatedatetime'] = arrow.utcnow().isoformat()
	dictline['insertdatetime'] = arrow.utcnow().isoformat()
	dictline['changetype'] = 2
	dictline['isinfeed'] = 1
	dictline['deleteflag'] = 0
	dictline['rejectedflag'] = 0
	dictline['errorflag'] = 0
	dictline['tenantid'] = tenantid
	dictline['feedtype'] = feedtype
	dictline['filename'] = filename
	dictline['line'] = line

	tokens = line.split('|')
	
	if ( len(rowschema) == len(tokens) ):
		for i, token in enumerate(tokens):
			if token:
				dictline[rowschema[i]] = token
	
		key= str(tenantid) + "|" + str(feedtype)
		keylayout= "tenantid|feedtype"
		
		for j, keyname in enumerate(rowkeyschema):
			key = key + "|" + tokens[rowschema.index(keyname)]
			keylayout = keylayout + "|" + keyname 

		if dictline.__contains__('Name'):
			dictline['NameLCase'] = dictline['Name'].lower()
		if dictline.__contains__('FirstName'):
			dictline['FirstNameLCase'] = dictline['FirstName'].lower()
		if dictline.__contains__('LastName'):
			dictline['LastNameLCase'] = dictline['LastName'].lower()
		if dictline.__contains__('MiddleName'):
			dictline['MiddleNameLCase'] = dictline['MiddleName'].lower()

		linevalues = {}
		linevalues['linekey'] = key
		linevalues['linekeylayout'] = keylayout
		linevalues['dictline'] = dictline

		return None, linevalues
	elif ( len(rowschema) != len(tokens) ):
		dictline['rejectedflag'] = 1
		dictline['errorflag'] = 1
		linevalues = {}
		exceptionLinekey = "{0}|{1}|{2}|{3}|{4}".format(tenantid, feedtype, filename, "Exception", shortuuid.uuid())
		linevalues['linekey'] = exceptionLinekey
		linevalues['linekeylayout'] = "{0}|{1}|{2}|{3}|{4}".format("tenantid", "feedtype", "filename", "Exception", "shortuuid")
		linevalues['dictline'] = dictline

		if ( len(rowschema) > len(tokens) ):
			logger.debug(exceptionLinekey)
			return RowSchemaLessMismatchException(filename, lineno, line), linevalues
		elif ( len(rowschema) < len(tokens) ):
			logger.debug(exceptionLinekey)
			return RowSchemaMoreMismatchException(filename, lineno, line), linevalues

		
def insertLine(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line):
	anyException, linevalues = lineToDictionary(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line)
	dictline =  linevalues['dictline']

	dictline['keylayout'] = linevalues['linekeylayout']
	logger.info ("insertLine:" + linevalues['linekey'])

	try:
		startProcess.cb.add(linevalues['linekey'], dictline)
		if anyException: 
			raise anyException
	except CouchbaseError as e:
		if (e is KeyExistsError):
			logger.debug ('insertLine: Exception={3}, FileName={0}, LineNo={1}, Line={2}'.format(filename, lineno, line, "RowDuplicateException"))
			raise RowDuplicateException(filename, lineno, line)
		else:
			logger.debug ('insertLine: Exception={3}, FileName={0}, LineNo={1}, Line={2}'.format(filename, lineno, line, e.__class__))
			raise RowException(filename, lineno, line)

	
def updateLine(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line):
	linevalues = lineToDictionary(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line)
	linelist = startProcess.cb.get(linevalues['dictline']).value
	startProcess.cb.set(linevalues['linekey'], linelist)
	
def deleteLine(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line):
	linevalues = lineToDictionary(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line)
	
	try:
		startProcess.cb.delete(linevalues['linekey'])
	except CouchbaseError as e:
		print ( "deleteLine: Exception: " + str(e.key))	
		raise
