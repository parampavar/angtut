
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];

/**
 * PlayerPosition Schema
 */

var PlayerPositionSchema = new Schema({
    abbr: {type: String},
    pos: {type: String}
})

PlayerPositionSchema.statics = {
	load: function(id, cb) {
		this.findOne( {_id: id} ).exec(cb);
	}
};

mongoose.model('PlayerPosition', PlayerPositionSchema)
