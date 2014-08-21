var roomMap = require('../context/roomContext').roomMap;
var p2pSocketWaiting = require('../context/roomContext').p2pSocketWaiting;

var configs = require('../../config');

/**
 * <p>绑定 join 事件</p>
 */
exports = module.exports = function (data) {

    console.log(this.id + "想加入聊天");

    // 0 处理不符合要求的
    var errorMsg;
    if (this.waiting == true) { // 已经在等待队列中
        errorMsg = '已经在等待中，请勿同时打开多个开房请求';
    } else if (this.rooms.length > configs.userConf.maxRoomCount) { // 超过限制房间数
        errorMsg = '已经超过限制房间数，无法打开更多房间';
    }
    if (errorMsg) { // 如果或者已经在等待队列中，直接返回
        this.emit('join', {
            isSuccess: false,
            msg: ''
        });
        return;
    }

    // 1 验证是否能够立刻开房
    var anotherSocketIndex;
    if (p2pSocketWaiting.length == 0) { // 看看有没有待连接的，没有的话就放进去
        p2pSocketWaiting.push(this);
        this.waiting = true;
        console.log(this.id + "被放到队列里面");
        return;
    } else { // 有待连接的，查找看哪一个可以连
        for (var i in p2pSocketWaiting) {
            var anotherSocket = p2pSocketWaiting[i];
            var roomId = generateRoomId(this.id, anotherSocket.id);
            if (!roomMap.hasOwnProperty(roomId)) { // 这两个人已经开房了
                anotherSocketIndex = i;
                break;
            }
        }
    }

    // 2 如果找不到可以聊的，放进去队列
    if (!anotherSocketIndex) {
        p2pSocketWaiting.push(this);
        this.waiting = true;
        return;
    }

    // 3. 走到这一步，终于要开房聊天了…
    var anotherSocket = p2pSocketWaiting[anotherSocketIndex];
    p2pSocketWaiting.splice(anotherSocketIndex, 1);
    var roomId = generateRoomId(this.id, anotherSocket.id);
    console.log(anotherSocket.id + "从队列里面拿出来准备聊天");
    this.join(roomId);
    this.waiting = false;
    anotherSocket.join(roomId);
    anotherSocket.waiting = false;
    roomMap[roomId] = [this, anotherSocket];

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

};

function generateRoomId(sourceId, destId) {
    return  sourceId > destId ? destId + '_-_' + sourceId : sourceId + '_-_' + destId;
}