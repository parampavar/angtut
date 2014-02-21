from celery import Celery
from celery import Task
from celery.utils.log import get_task_logger
from collections import namedtuple
from datetime import datetime
import os
import glob
import re
import json
import locking
import time

from couchbase import Couchbase
from couchbase.exceptions import CouchbaseError
from couchbase.exceptions import KeyExistsError, NotFoundError
from couchbase.views.iterator import RowProcessor
from couchbase.views.params import UNSPEC, Query


feedtype = None
rowkeyschema = {}
rowschema = {}

app = Celery('processfiles', broker='amqp://celery:celery@localhost:5672/celery')
logger = get_task_logger(__name__)

class DatabaseTask(Task):
	abstract = True
	_db = None
	_FeedDefinitions = {}

	@property
	def cb(self):
		if self._db is None:
			self._db = Couchbase.connect(bucket='default')
		return self._db

	@property
	def FeedDefinitions(self):
		if self._db is None:
			self._db = Couchbase.connect(bucket='default')
			_FeedDefinitions = self._db.get("0|FEEDCONFIG").value
		return _FeedDefinitions

@app.task(base=DatabaseTask)
def startProcess():
	path = "feeds/"
	# logger.info("Listing 0|FEEDCONFIG doc from cb")
	# logger.info(startProcess.FeedDefinitions)
	# logger.info("Listing 1|FEEDCONFIG doc from cb")
	# logger.info(startProcess.cb.get("1|FEEDCONFIG").value)
	cbDocument = startProcess.cb.get("1|FEEDCONFIG").value
	if ( cbDocument ):
		# for k, v in cbDocument["CONFIGS"].items(): #FeedDefinitions.iteritems():
			# logger.debug (v)
		# if ( k == 'CUSTOMER' or k == 'SURGEON' ):
			# rowkeyschema = v['rowkeyschema']
			# rowschema = v['rowschema']
			# logger.debug ("rowschema=================")
			# logger.debug (rowschema)
			# logger.debug ("rowkeyschema-----------------")
			# logger.debug (rowkeyschema)
	
		
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
					for k, v in cbDocument["CONFIGS"].items(): #FeedDefinitions.iteritems():
						if infile.find(k) > 0:
							feedtype = k
							rowkeyschema = v['rowkeyschema']
							rowschema = v['rowschema']
							# logger.debug ('feedType ==' + k)
							# logger.debug ("rowschema=================")
							# logger.debug (rowschema)
							# logger.debug ("rowkeyschema-----------------")
							# logger.debug (rowkeyschema)
							
							for lineno, line in enumerate(lines):
								if line.startswith('HDR'):
									pass
								elif line.startswith('TRL'):
									pass
								else:
									try:
										#linevalues = lineToDictionary(infile, 1, feedtype, rowkeyschema, rowschema, lineno, line)
										insertLine(infile, 1, feedtype, rowkeyschema, rowschema, lineno, line)
										logger.debug (line)
									except:
										pass
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
			
class FileProcessException(Exception):
	"""
    Attributes:
        file -- name of the file that is being processed
    """
	def __init__(self, file):
		self.file = file
			
class FileAccessException(FileProcessException):
	pass

class FileSchemaException(FileProcessException):
	pass

class RowSchemaMismatchException(FileSchemaException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line, message):
		FileSchemaException.__init__(self, file)
		self.lineno = lineno
		self.line = line
		self.message = message

class RowSchemaMoreMismatchException(RowSchemaMismatchException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line):
		RowSchemaMismatchException.__init__(self, file, lineno, line, "Line has more columns than defined in the Schema")

class RowSchemaLessMismatchException(RowSchemaMismatchException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line):
		RowSchemaMismatchException.__init__(self, file, lineno, line, "Line has fewer columns than defined in the Schema")

	
def lineToDictionary(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line):
	dictline = {}
	tokens = line.split('|')
	
	if ( len(rowschema) > len(tokens) ):
		raise RowSchemaLessMismatchException(filename, lineno, line)
	elif ( len(rowschema) < len(tokens) ):
		raise RowSchemaMoreMismatchException(filename, lineno, line)
	elif ( len(rowschema) == len(tokens) ):
		for i, token in enumerate(tokens):
			if token:
				dictline[rowschema[i]] = token
	
		key= str(tenantid) + "|" + str(feedtype)
		keylayout= "tenantid|feedtype"
		
		for j, keyname in enumerate(rowkeyschema):
			#print ("keyindex:" + str(j) + " keyname:" + key + " rowSchemaindex:" + str(rowschema.index(key)) + " rowvalue:" + tokens[rowschema.index(key)])
			key = key + "|" + tokens[rowschema.index(keyname)]
			keylayout = keylayout + "|" + keyname 

		linevalues = {}
		linevalues['linekey'] = key
		linevalues['linekeylayout'] = keylayout
		linevalues['dictline'] = dictline
		return linevalues

		
def insertLine(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line):
		
	linevalues = lineToDictionary(filename, tenantid, feedtype, rowkeyschema, rowschema, lineno, line)
	dictline =  linevalues['dictline']
	if dictline.__contains__('Name'):
		dictline['NameLCase'] = dictline['Name'].lower()
	if dictline.__contains__('FirstName'):
		dictline['FirstNameLCase'] = dictline['FirstName'].lower()
	if dictline.__contains__('LastName'):
		dictline['LastNameLCase'] = dictline['LastName'].lower()
	if dictline.__contains__('MiddleName'):
		dictline['MiddleNameLCase'] = dictline['MiddleName'].lower()

	dictline['updatedatetime'] = datetime.utcnow().isoformat()
	dictline['insertdatetime'] = datetime.utcnow().isoformat()
	dictline['changetype'] = 2
	dictline['isinfeed'] = 1
	dictline['deleteflag'] = 0
	dictline['rejectedflag'] = 0
	dictline['errorflag'] = 0
	dictline['tenantid'] = tenantid
	dictline['feedtype'] = feedtype
	dictline['filename'] = filename
	dictline['keylayout'] = linevalues['linekeylayout']
	logger.info ("insertLine:" + linevalues['linekey'])
	
	try:
		startProcess.cb.add(linevalues['linekey'], dictline)
		#pass
	except CouchbaseError as e:
		logger.info ( "insertLine: Exception: " + str(e.key))
		raise
	
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
