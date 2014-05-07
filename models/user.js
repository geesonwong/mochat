var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var UserSchema = new Schema({

    name: {type: String},
    face: {type: String},
    desc: {type: String},
    ip: {type: String},
    login_times: {type: Number},
    last_login_time: {type: Date}

});

exports.schema = UserSchema;
mongoose.model('User', UserSchema);