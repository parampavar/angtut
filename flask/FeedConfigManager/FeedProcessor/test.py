from couchbase import Couchbase
from couchbase.exceptions import CouchbaseError
from collections import namedtuple
import json
from couchbase.exceptions import KeyExistsError, NotFoundError
from couchbase.views.iterator import RowProcessor
from couchbase.views.params import UNSPEC, Query
from datetime import datetime
import os
import glob
import re

SurgeonFileRowSchema = ["SurgeonID", "MENumber",  "DEANumber",  "IMSNumber",  "Speciality",  "FirstName",  "MiddleName",  "LastName",  "City",  "State",  "Zip",  "Country"] 
SurgeonFileRowKeySchema = ['SurgeonID', 'FirstName', 'LastName', 'City', 'State']

CustomerFileRowSchema = ['ROWTAG', 'AccountNumber',  'CustomerType',  'Name',  'FirstName',  'MiddleName',  'LastName',  'TerritoryNumber',  'BillToNumber',  'BillToStreet1',  'BillToStreet2',  'BillToCity',  'BillToState',  'BillToZip',  'BillToCountry',  'ShipToNumber',  'ShipToName',  'PrimaryLocationFlag',  'ShipToStreet1',  'ShipToStreet2',  'ShipToCity',  'ShipToState',  'ShipToZip',  'ShipToCountry',  'MailToStreet1',  'MailToStreet2',  'MailToCity',  'MailToState',  'MailToZip',  'MailToCountry',  'Phone',  'Fax',  'Email',  'Operation']
CustomerFileRowKeySchema = ['TerritoryNumber', 'AccountNumber', 'CustomerType', 'ShipToNumber', 'PrimaryLocationFlag']
	
FeedDefinitions = {}
FeedDefinitions= {'CUSTOMER': {'type': 'CUSTOMER', 'rowschema': CustomerFileRowSchema, 'rowkeyschema': CustomerFileRowKeySchema}, 
				  'SURGEON': {'type': 'SURGEON', 'rowschema': SurgeonFileRowSchema, 'rowkeyschema': SurgeonFileRowKeySchema} }

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

cb = Couchbase.connect(bucket='default')
path = "feeds/"
feedtype = None
rowkeyschema = {}
rowschema = {}
for infile in glob.glob( os.path.join(path, '*.txt') ):
	print ("Processing file : " + infile)
		
	with open(infile, 'r') as content_file:
		content = content_file.read()

	lines = content.splitlines()
	firstline = lines[0]
	lastline = lines[len(lines)-1]
	
	trlRowCount = int(lastline.split("|")[1])
	if ( trlRowCount == (len(lines) - 2) ):
		if (trlRowCount > 0):
			for k, v in FeedDefinitions.items(): #FeedDefinitions.iteritems():
				if infile.find(k) > 0:
					#print ('feedType ==' + k)
					feedtype = k
					rowkeyschema = v['rowkeyschema']
					rowschema = v['rowschema']
					
					for line in lines:
						if line.startswith('HDR'):
							pass
						elif line.startswith('TRL'):
							pass
						else:
							#deleteLine(rowkeyschema, rowschema, 1, feedtype, infile, line)
							#insertLine(rowkeyschema, rowschema, 1, feedtype, infile, line)
							pass
			print ("Successfully processed file : " + infile + " with " + str(trlRowCount) + " lines.")
		elif (trlRowCount == 0):
			print ("Successfully processed file : " + infile + " with " + str(trlRowCount) + " line.")
	else:
		print("Rowcount mismatch")