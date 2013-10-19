
var async = require('async')

module.exports = function (app, passport, auth) {

	// user routes
	var users = require('../app/controllers/users')
	app.get('/signin', users.signin)
	app.get('/signup', users.signup)
	app.get('/signout', users.signout)
	app.post('/users', users.create)
	app.post('/users/session', passport.authenticate('local', {failureRedirect: '/signin', failureFlash: 'Invalid email or password.'}), users.session)
	app.get('/users/me', users.me)
	app.get('/users/:userId', users.show)

	app.param('userId', users.user)

	var leagues = require('../app/controllers/leagues')
	app.get('/leagues', leagues.all)
	app.post('/leagues', auth.requiresLogin, leagues.create)
	app.get('/leagues/:leagueId', leagues.show)
	app.put('/leagues/:leagueId', auth.requiresLogin, leagues.update)
	app.del('/leagues/:leagueId', auth.requiresLogin, leagues.destroy)
	app.param('leagueId', leagues.league)

    var fantasyteams = require('../app/controllers/fantasyteams')
    app.get('/fantasyteams', fantasyteams.all)
    app.post('/fantasyteams', auth.requiresLogin, fantasyteams.create)
    app.get('/fantasyteams/:leagueId', leagues.show)
    app.put('/fantasyteams/:leagueId', auth.requiresLogin, fantasyteams.update)
    app.del('/fantasyteams/:leagueId', auth.requiresLogin, fantasyteams.destroy)
    app.param('fantasyteamId', fantasyteams.fantasyteam)

    var nflteams = require('../app/controllers/nflteams')
    app.get('/nflteams', nflteams.all)
    app.get('/nflteams/:nflteamId', nflteams.show)
    app.param('nflteamId', nflteams.nflteam)

    var playerpositions = require('../app/controllers/playerpositions')
    app.get('/playerpositions', playerpositions.all)
    app.get('/playerpositions/:playerpositionsId', playerpositions.show)
    app.param('playerpositionsId', playerpositions.playerposition)


    // home route
	var index = require('../app/controllers/index')
	app.get('/', index.render)

}
