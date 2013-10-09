
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , League = mongoose.model('League')
  , async = require('async')
  , _ = require('underscore')

/**
 * Create 
 */

exports.create = function (req, res) {
	var league = new League(req.body)
	league.commissioner = req.user
	league.save()
	res.jsonp(league)
}

/**
 * Show 
 */

exports.show = function (req, res) {
  res.jsonp(req.league)
}

exports.league = function (req, res, next, id) {
	var League = mongoose.model('League')
	
	League.load(id, function (err, league) {
		if (err) return next(err)
		if (!league) return next(new Error('Failed to load league ' + id))
		req.league = league
		next()
		}
	)
}

/**
 * all
 */

exports.all = function (req, res) {
	League.find().populate('commissioner').exec(function(err, leagues){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(leagues);
	}
	);
}

/**
 * update
 */
exports.update = function (req, res) {
	var league = req.league
	league = _.extend(league, req.body)
	league.save(function(err) {
		res.jsonp(league)
	}
	)
}

/**
 * destroy
 */

exports.destroy = function (req, res) {
	var league = req.league
	league.remove(function(err){
		if (err)
			res.render('error', {status:500});
		else
			res.jsonp(1);
	}
	);
}