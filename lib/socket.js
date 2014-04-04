var SocketIo = require('socket.io');

/**
 * 建立 socket
 */
exports = module.exports = function (server) {
    var io = SocketIo(server);

    // 建立连接的时候
    io.sockets.on('connection', function (socket) {
            var user;
            var cookie = parseCookie(socket.handshake.headers.cookie);
            user = cookie['user'];
            if (user) {
                //parseCookie的返回值不能写
                user = {'face': user.face, 'name': user.name};
            } else {
                user = {'face': 0, 'name': '陌生人'}
            }

            user.socket = socket;
            socket.on('global.iEneterRoom', function (data) {
                roomlist.enter(user, data['position']);
            })
        }
    );

//    io.set('authorization', function (handshakeData, callback) {
//        // 通过客户端的cookie字符串来获取其session数据
//        if (handshakeData.headers.cookie) {
//            handshakeData.cookie = parseCookie(handshakeData.headers.cookie);
//            var connect_sid = handshakeData.cookie['connect.sid'];//.slice(0, val.lastIndexOf('.'))
//            connect_sid = connect_sid.indexOf('s:') >= 0 ? connect_sid.slice(2, connect_sid.lastIndexOf('.')) : connect_sid;
//            console.log(connect_sid);
//            if (connect_sid) {
//                storeMemory.get(connect_sid, function (error, session) {
//                    if (error) {
//                        // if we cannot grab a session, turn down the connection
//                        callback(error.message, false);
//                    }
//                    else {
//                        // save the session data and accept the connection
//                        handshakeData.session = session;
//                        callback(null, true);
//                    }
//                });
//            }
//            else {
//                callback('nosession');
//            }
//        } else {
//            callback(null, true);
//        }
//    });

};
