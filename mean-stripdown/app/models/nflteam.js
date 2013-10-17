
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];

/**
 * NFLTeam Schema
 */

var NFLTeamSchema = new Schema({
    abbr: {type: String},
    team: {type: String},
    mascot: {type: String},
    conference: {type: String}
})

NFLTeamSchema.statics = {
	load: function(id, cb) {
		this.findOne( {_id: id} ).exec(cb);
	}
};

mongoose.model('NFLTeam', NFLTeamSchema)
