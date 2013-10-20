
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];

/**
 * Player Schema
 */

var PlayerSchema = new Schema({
    team: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    num: {type: String},
    pos: {type: String}
})

PlayerSchema.statics = {
	load: function(id, cb) {
		this.findOne( {_id: id} ).exec(cb);
	}
};

mongoose.model('Player', PlayerSchema)
