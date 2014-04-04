var server = require('http').Server();
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    io.sockets;
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('event', function (data) {
    });
    socket.on('disconnect', function () {
    });
});
server.listen(4000);