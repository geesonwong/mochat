/**
 * <p>绑定 message 事件</p>
 */
exports = module.exports = function (io) {

    io.on('connection', function (socket) {
        socket.on('message', function (data) {
            
        });
    });

};