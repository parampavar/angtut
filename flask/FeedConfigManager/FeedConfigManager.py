#from couchbase import Couchbase
#from couchbase.exceptions import CouchbaseError
#from couchbase.exceptions import KeyExistsError, NotFoundError
#from couchbase.views.iterator import RowProcessor
#from couchbase.views.params import UNSPEC, Query

from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash
from flask import redirect, send_from_directory
from flask import send_file, make_response

from datetime import datetime
	 
# configuration
DATABASE = 'default'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

INBOUND_PATH = 'feeds/'

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)

SurgeonFileRowSchema = ["SurgeonID", "MENumber",  "DEANumber",  "IMSNumber",  "Speciality",  "FirstName",  "MiddleName",  "LastName",  "City",  "State",  "Zip",  "Country"] 
SurgeonFileRowKeySchema = ['SurgeonID', 'FirstName', 'LastName', 'City', 'State']

CustomerFileRowSchema = ['ROWTAG', 'AccountNumber',  'CustomerType',  'Name',  'FirstName',  'MiddleName',  'LastName',  'TerritoryNumber',  'BillToNumber',  'BillToStreet1',  'BillToStreet2',  'BillToCity',  'BillToState',  'BillToZip',  'BillToCountry',  'ShipToNumber',  'ShipToName',  'PrimaryLocationFlag',  'ShipToStreet1',  'ShipToStreet2',  'ShipToCity',  'ShipToState',  'ShipToZip',  'ShipToCountry',  'MailToStreet1',  'MailToStreet2',  'MailToCity',  'MailToState',  'MailToZip',  'MailToCountry',  'Phone',  'Fax',  'Email',  'Operation']
CustomerFileRowKeySchema = ['TerritoryNumber', 'AccountNumber', 'CustomerType', 'ShipToNumber', 'PrimaryLocationFlag']

FeedDefinitions = {}
FeedDefinitions= {'CUSTOMER': {'type': 'CUSTOMER', 'rowschema': CustomerFileRowSchema, 'rowkeyschema': CustomerFileRowKeySchema}, 
				  'SURGEON': {'type': 'SURGEON', 'rowschema': SurgeonFileRowSchema, 'rowkeyschema': SurgeonFileRowKeySchema} }

		  
def connect_db():
#	return Couchbase.connect(bucket=app.config['DATABASE'])
	return None

def get_db():
    if not hasattr(g, 'couch_db'):
        g.couch_db = connect_db()
    return g.couch_db	
	
@app.before_request
def before_request():
	g.db = connect_db()

# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/about')
@app.route('/blog')
@app.route('/about/<name>')
def basic_pages(**kwargs):
	return make_response(open('templates/index.html').read())

@app.route('/feedconfigtype')
@app.route('/feedconfigtype/<type_name>')
def show_feedconfigtypes(type_name=None):
	print ("I am here")
	return make_response(open('templates/index.html').read())

@app.route('/feedconfigtype/add', methods=['POST'])
def add_feedconfigtype():
	linekey = '1|FEEDCONFIG'
	linekeylayout = 'tenantid|FEEDCONFIG'
	dictline = {}
	currentfeedConfig = {}
	currentfeedConfig = { 	"name": request.form['name'], "type": request.form['type'], "description": request.form['description'], 
						"createdby": request.form['createdby'], "updatedby": request.form['updatedby'],
						'updatedatetime' : datetime.utcnow().isoformat(), 'insertdatetime': datetime.utcnow().isoformat()
						}
	
	linekeyfound = False
	configtypes = {}
#	try:
	dictline = g.db.get(linekey).value
	configtypes = dictline['CONFIGS']
	linekeyfound = True
	#pass
#	except CouchbaseError as e:
#		print ( "add_feedconfigtype: Exception: " + str(e.key))

	configtypes[request.form['type']] = currentfeedConfig
		
	dictline['insertdatetime'] = datetime.utcnow().isoformat()
	dictline['tenantid'] = 1
	dictline['keylayout'] = linekeylayout
	dictline['CONFIGS'] = configtypes

#	try:
	g.db.set(linekey, dictline)
#	except CouchbaseError as e:
#		print ( "add_feedconfigtype: Exception: " + str(e.key))
		
	flash('New entry was successfully added')
	return redirect(url_for('show_feedconfigtypes'))


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

	
if __name__ == '__main__':
	app.debug = True
	#app.run(port=5555)	
	app.run()
