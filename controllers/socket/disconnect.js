var roomMap = require('../context/roomContext').roomMap;
var p2pSocketWaiting = require('../context/roomContext').p2pSocketWaiting;
var os = require('os');

/**
 * <p>绑定 disconnect 事件</p>
 */
exports = module.exports = function (data) {
    console.log(this.id + "关闭了网页");
    for (var i in this.rooms) {
        if (this.rooms[i] != this.id)
            _leaveRoom_(this.rooms[i], this);
    }
};

function _leaveRoom_(roomId, socket) {
    // 1 发送消息给该房间其他人
    socket.to(roomId).emit('notice', {
        roomId: roomId,
        content: socket.name || '对方' + '已经离开',
        time: getTime(),
        sender: '通知'
    });

    // 2 删掉等待队列中的它
    var index = p2pSocketWaiting.indexOf(socket);
    if (index != -1)
        p2pSocketWaiting.splice(index, 1);

    // 3 它自己离开房间，房间名单也开除他
    socket.leave(roomId);
    if (!roomMap.hasOwnProperty(roomId)) {
        return;
    }
    var socketsInRoom = roomMap[roomId];
    index = socketsInRoom.indexOf(socket);
    socketsInRoom.splice(index, 1);

    // 4. 检查是不是该房间只有一个人了，是的话要自动断开
    if (socketsInRoom.length == 1) {
        socketsInRoom[0].leave(roomId);
        socketsInRoom[0].emit('leave', {
            roomId: roomId
        });
        delete roomMap[roomId];
    }
}

function getTime() {
    return (new Date(os.uptime())).toTimeString().split(' ')[0];
}