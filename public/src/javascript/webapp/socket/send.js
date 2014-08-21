define(function () {

    /**
     * 发送客户端信息
     * @param opts
     */
    var info = function (socket, opts) {
        socket.emit('info', {
            clientId: opts.clientId
        });
    };

    return {
        info: info
    }

});