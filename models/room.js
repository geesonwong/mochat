var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var UserSchema = require('./user').schema;
var TopicSchema = require('./topic').schema;

var RoomSchema = new Schema({

    name: {type: String},
    creator: {type: UserSchema},
    topic: {type: TopicSchema},
    login_times: {type: Number},
    last_login_time: {type: Date}

});

mongoose.model('Room', RoomSchema);