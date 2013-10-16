
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , League = mongoose.model('FantasyTeam')
  , async = require('async')
  , _ = require('underscore')

/**
 * Create 
 */

exports.create = function (req, res) {
	var fantasyteam = new FantasyTeam(req.body)
    fantasyteam.owner = req.user
    fantasyteam.league = req.body.league
    fantasyteam.save()
	res.jsonp(fantasyteam)
}

/**
 * Show 
 */

exports.show = function (req, res) {
  res.jsonp(req.fantasyteam)
}

exports.fantasyteam = function (req, res, next, id) {
	var Fantasyteam = mongoose.model('FantasyTeam')

    Fantasyteam.load(id, function (err, fantasyteam) {
		if (err) return next(err)
		if (!league) return next(new Error('Failed to load fantasyteam ' + id))
		req.fantasyteam = fantasyteam
		next()
		}
	)
}

/**
 * all
 */

exports.all = function (req, res) {
    Fantasyteam.find().populate('owner').populate('league').exec(function(err, fantasyteams){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(fantasyteams);
	}
	);
}

/**
 * update
 */
exports.update = function (req, res) {
	var fantasyteam = req.fantasyteam
    fantasyteam = _.extend(fantasyteam, req.body)
    fantasyteam.save(function(err) {
		res.jsonp(fantasyteam)
	}
	)
}

/**
 * destroy
 */

exports.destroy = function (req, res) {
	var fantasyteam = req.fantasyteam
    fantasyteam.remove(function(err){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(1);
	}
	);
}