var SocketIo = require('socket.io');

var socketController = require('./index');

/**
 * <p>绑定 init 事件</p>
 */
exports = module.exports = function (server) {

    var io = SocketIo(server);

    io.on('connection', function (socket) {
        // 网页打开，开始建立连接，并且绑定事件
        console.log(socket.id + "打开网页创建连接");
        socket.face = 'http://bcs.duapp.com/imocha-face/index/' + Math.ceil(Math.random() * 166) + '.gif';

        socket.on('leave', socketController.leave);
        socket.on('join', socketController.join);
        socket.on('msg', socketController.message);
        socket.on('profile', socketController.profile);
        socket.on('disconnect', socketController.disconnect);

    });

};