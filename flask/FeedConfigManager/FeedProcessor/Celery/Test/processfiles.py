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
	logger.info("Listing 1|FEEDCONFIG doc from cb")
	logger.info(startProcess.cb.get("1|FEEDCONFIG").value)
	for k, v in startProcess.cb.get("1|FEEDCONFIG").value.items(): #FeedDefinitions.iteritems():
		logger.debug ("-----------------")
		logger.debug (k)
		logger.debug ("=================")
		logger.debug (v)
	
	"""
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
				for k, v in startProcess.cb.get("1|FEEDCONFIG").value.items(): #FeedDefinitions.iteritems():
					if infile.find(k) > 0:
						logger.debug ('feedType ==' + k)
						feedtype = k
						rowkeyschema = v['rowkeyschema']
						rowschema = v['rowschema']
						
						for line in lines:
							if line.startswith('HDR'):
								pass
							elif line.startswith('TRL'):
								pass
							else:
								linevalues = lineToDictionary(rowkeyschema, rowschema, 1, feedtype, line)
								logger.debug ('dictline ==' + linevalues['dictline'])
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
	"""	
	
	
def lineToDictionary(rowkeyschema, rowschema, tenantid, feedtype, line):
	dictline = {}
	tokens = line.split('|')
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

def insertLine(rowkeyschema, rowschema, tenantid, feedtype, filename, line):
		
	linevalues = lineToDictionary(rowkeyschema, rowschema, tenantid, feedtype, line)
	dictline =  linevalues['dictline']
	#print (dictline)
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
	#print ("insertLine:" + linevalues['linekey'])
	
	try:
		cb.add(linevalues['linekey'], dictline)
		#pass
	except CouchbaseError as e:
		print ( "insertLine: Exception: " + str(e.key))
	
def updateLine(line):
	linevalues = lineToDictionary(line)
	linelist = cb.get(linevalues['dictline']).value
	cb.set(linevalues['linekey'], linelist)
	
def deleteLine(rowkeyschema, rowschema, tenantid, feedtype, filename, line):
	linevalues = lineToDictionary(rowkeyschema, rowschema, tenantid, feedtype, line)
	
	try:
		cb.delete(linevalues['linekey'])
	except CouchbaseError as e:
		print ( "deleteLine: Exception: " + str(e.key))	
