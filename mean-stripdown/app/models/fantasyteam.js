
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];

/**
 * FantasyTeam Schema
 */

var FantasyTeamSchema = new Schema({
    name: {type: String},
    owner: {type: Schema.ObjectId, ref: 'User'},
    league: {type: Schema.ObjectId, ref: 'League'},
    players: [{type: Schema.ObjectId, ref: 'Player'}]
})

LeagueSchema.statics = {
	load: function(id, cb) {
		this.findOne( {_id: id} ).populate('owner').populate('league').exec(cb);
	}
};

mongoose.model('FantasyTeam', FantasyTeamSchema)
