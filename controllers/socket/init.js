//var models = require('../../models/dao');
var Q = require('q');
//var UserDao = models.UserDao;
var SocketIo = require('socket.io');

var join = require('./join');
var leave = require('./leave');

/**
 * <p>绑定 init 事件</p>
 */
exports = module.exports = function (io) {

    io.on('connection', function (socket) {
        console.log('01');
        socket.on('join', function (data) {
            console.log('02');
        });
    });

    var on$io = Q.nbind(io.on, io);
    var onPromise = on$io('connection');

    onPromise.then(function (socket) {
        console.log('aaaa');
    }, dualSocket);

    function dualSocket(socket) {
        var onEvent = Q.nbind(socket.on, socket);
        join(onEvent);
    }

//    Q.nfcall(io.on, ['connection']).done(function () {
//        console.log('-----------------------------------');
//    });


//    Q.npost(io, 'on', ['connection']).done(function () {
//        console.log('!!')
//    });


//    var a = Q.denodeify(io.on);
//    a('connection').done(function () {
//        console.log('asdf')
//    });
//    Q.denodeify(io.a, 'connection').done(function (socket) {
//        console.log('11');
//        return Q.denodeify(socket, 'b', 'init');
//    }).then(function (data) {
//        console.log('12');
//    });

//        var userId = data.userId;
//        var ip = socket.handshake.address;
//        if (!userId) { // 首次登录，创建账号
//            var qAdd = Q.denodeify(UserDao.add);
//            qAdd(ip).fail(function () {
//
//            });
//        }


};