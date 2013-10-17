
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , NFLTeam = mongoose.model('NFLTeam')
  , async = require('async')
  , _ = require('underscore')


exports.show = function (req, res) {
  res.jsonp(req.nflTeam)
}

exports.nflteam = function (req, res, next, id) {
	var NFLTeam = mongoose.model('NFLTeam')

    NFLTeam.load(id, function (err, nflTeam) {
		if (err) return next(err)
		if (!nflTeam) return next(new Error('Failed to load NFLTeam ' + id))
		req.nflTeam = nflTeam
		next()
		}
	)
}

/**
 * all
 */

exports.all = function (req, res) {
    NFLTeam.find().exec(function(err, nflTeams){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(nflTeams);
	}
	);
}

