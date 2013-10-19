
/**
 * Module dependencies. PlayerPosition, playerposition
 */

var mongoose = require('mongoose')
  , PlayerPosition = mongoose.model('PlayerPosition')
  , async = require('async')
  , _ = require('underscore')


exports.show = function (req, res) {
  res.jsonp(req.playerposition)
}

exports.playerposition = function (req, res, next, id) {
	var PlayerPosition = mongoose.model('PlayerPosition')

    PlayerPosition.load(id, function (err, playerposition) {
		if (err) return next(err)
		if (!playerposition) return next(new Error('Failed to load PlayerPosition ' + id))
		req.playerposition = playerposition
		next()
		}
	)
}

/**
 * all
 */

exports.all = function (req, res) {
    PlayerPosition.find().exec(function(err, playerpositions){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(playerpositions);
	}
	);
}

