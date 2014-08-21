var SocketIo = require('socket.io');
var os = require('os');
var configs = require('../config');

var p2pSocketWaiting, roomMap = {}, io;


/**
 * 建立 socket
 */
exports = module.exports = function (server) {

    p2pSocketWaiting = [];
    roomMap = {};
    io = SocketIo(server);

    // 建立连接的时候
    io.on('connection', function (socket) {
        // 网页打开，开始建立连接，并且绑定事件
        console.log(socket.id + "打开网页创建连接");

        socket.face = 'http://bcs.duapp.com/imocha-face/index/' + Math.ceil(Math.random() * 166) + '.gif';

        // leave 离房事件
        socket.on('leave', function (data) {
            console.log(socket.id + "离开房间" + data.roomId);
            if (!data.roomId || !roomMap.hasOwnProperty(data.roomId))
                return;

            _leaveRoom_(data.roomId, socket);

            // 发送成功退房的消息
            socket.emit('leave', {
                roomId: data.roomId
            })
        });

        // join 开房事件
        socket.on('join', function () {
            console.log(socket.id + "想加入聊天");

            // 0 处理不符合要求的
            var errorMsg;
            if (socket.waiting == true) { // 已经在等待队列中
                errorMsg = '已经在等待中，请勿同时打开多个开房请求';
            } else if (socket.rooms.length > configs.userConf.maxRoomCount) { // 超过限制房间数
                errorMsg = '已经超过限制房间数，无法打开更多房间';
            }
            if (errorMsg) { // 如果或者已经在等待队列中，直接返回
                socket.emit('join', {
                    isSuccess: false,
                    msg: ''
                });
                return;
            }

            // 1 验证是否能够立刻开房
            var anotherSocketIndex;
            if (p2pSocketWaiting.length == 0) { // 看看有没有待连接的，没有的话就放进去
                p2pSocketWaiting.push(socket);
                socket.waiting = true;
                console.log(socket.id + "被放到队列里面");
                return;
            } else { // 有待连接的，查找看哪一个可以连
                for (var i in p2pSocketWaiting) {
                    var anotherSocket = p2pSocketWaiting[i];
                    var roomId = generateRoomId(socket.id, anotherSocket.id);
                    if (!roomMap.hasOwnProperty(roomId)) { // 这两个人已经开房了
                        anotherSocketIndex = i;
                        break;
                    }
                }
            }

            // 2 如果找不到可以聊的，放进去队列
            if (!anotherSocketIndex) {
                p2pSocketWaiting.push(socket);
                socket.waiting = true;
                return;
            }

            // 3. 走到这一步，终于要开房聊天了…
            var anotherSocket = p2pSocketWaiting[anotherSocketIndex];
            p2pSocketWaiting.splice(anotherSocketIndex, 1);
            var roomId = generateRoomId(socket.id, anotherSocket.id);
            console.log(anotherSocket.id + "从队列里面拿出来准备聊天");
            socket.join(roomId);
            socket.waiting = false;
            anotherSocket.join(roomId);
            anotherSocket.waiting = false;
            roomMap[roomId] = [socket, anotherSocket];

            // 4. 发送成功开房的消息
            var members = [];
            for (var i in roomMap[roomId]) {
                var member = {
                    id: roomMap[roomId][i].id,
                    nickname: roomMap[roomId][i].nickname || '陌生人',
                    face: roomMap[roomId][i].face || configs.front.randomFace,
                    desc: roomMap[roomId][i].desc || configs.front.defaultDesc
                };
                members.push(member);
            }
            for (var i in roomMap[roomId]) {
                console.log(roomMap[roomId][i].id + '可以开始聊了');
                roomMap[roomId][i].emit('join', {
                    isSuccess: true,
                    id: roomMap[roomId][i].id,
                    roomId: roomId,
                    members: members
                });
            }
        });

        // msg 发送消息
        socket.on('msg', function (data) {
            if (!data.roomId || !roomMap.hasOwnProperty(data.roomId))
                return;
            console.log(socket.id + "发送消息，内容是" + data.content);
            socket.to(data.roomId).emit('msg', {
                roomId: data.roomId,
                content: data.content,
                time: getTime(),
                sender: {
                    id: socket.id,
                    nickname: socket.nickname || '陌生人'
                }
            });
        });

        // profile 改变个人资料
        socket.on('profile', function (data) {
            if (!data)
                return;
            console.log(socket.id + '改变个人资料' + data.face + ',' + data.nickname);
            socket.nickname = data.nickname || socket.nickname;
            socket.face = data.face || socket.face;
            socket.desc = data.desc || socket.desc;
            socket.rooms.forEach(function (roomId) {
                socket.to(roomId).emit('profile', {
                    id: socket.id,
                    roomId: roomId,
                    nickname: socket.nickname,
                    face: socket.face,
                    desc: socket.desc
                });
            });
        });

        // disconnect 关闭网页
        socket.on('disconnect', function () {
            console.log(socket.id + "关闭了网页");
            for (var i in socket.rooms) {
                if (socket.rooms[i] != socket.id)
                    _leaveRoom_(socket.rooms[i], socket);
            }
        });

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

    })
};

exports.yard = function () {
    return {
        waiting: p2pSocketWaiting,
        roomMap: roomMap,
        socketIO: io
    };
};

function getTime() {
    return (new Date(os.uptime())).toTimeString().split(' ')[0];
}

function generateRoomId(sourceId, destId) {
    return  sourceId > destId ? destId + '_-_' + sourceId : sourceId + '_-_' + destId;
}