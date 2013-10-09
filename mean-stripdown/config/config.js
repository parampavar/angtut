
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://zoobi.dtdns.net:4100/ngff-dev',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'ngFantasyFootball - Development'
    }
  },
  test: {
    db: 'mongodb://zoobi.dtdns.net:4100/ngff-test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'ngFantasyFootball - Test'
    }
  },
  production: {
    db: 'mongodb://zoobi.dtdns.net:4100/ngff',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'ngFantasyFootball - Production'
    }
  }
}
