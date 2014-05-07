var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.dbc.host, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

// models
require('./user');
require('./room');
require('./topic');

exports.User = mongoose.model('User');
exports.Room = mongoose.model('Room');
exports.Topic = mongoose.model('Topic');