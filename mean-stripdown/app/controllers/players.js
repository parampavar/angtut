
/**
 * Module dependencies. Player, player
 */

var mongoose = require('mongoose')
  , Player = mongoose.model('Player')
  , async = require('async')
  , _ = require('underscore')


exports.show = function (req, res) {
  res.jsonp(req.player)
}

exports.player = function (req, res, next, id) {
	var Player = mongoose.model('Player')

    Player.load(id, function (err, player) {
		if (err) return next(err)
		if (!player) return next(new Error('Failed to load Player ' + id))
		req.player = player
		next()
		}
	)
}

/**
 * all
 */

exports.all = function (req, res) {
    Player.find().exec(function(err, players){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(players);
	}
	);
}

