var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var UserSchema = require('./user').schema;

var TopicSchema = new Schema({

    title: {type: String},
    creator: {type: UserSchema},
    create_time: {type: Date}

});

mongoose.model('Topic', TopicSchema);
exports.schema = TopicSchema;