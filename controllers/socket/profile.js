/**
 * <p>绑定 profile 事件</p>
 */
exports = module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('profile', function (data) {
            
        });
    });

};