var os = require('os');

function Room(position, name, mode, max) {
    this.position = position;
    this.name = name;
    this.mode = mode ? mode : 0; // 默认是双人模式
    this.max = max ? max : 2; // 默认限制只有2个人
    this.socketList = [];
}

Room.MODE = {
    P2P: 0, //双人聊天
    CLUB: 1, //多人聊天
    MEETING: 2 //招待会（一个人跟多个人聊天）
};

Room.MESSAGE = {
    START: '你们可以开始聊天了',
    END: '对方已经离开'
};


Room.RESULT = {
    OK: '正常',
    NOT_ENOUGH_MEMBER: '房间人数不够',
    FULL: '房间已经满了'
};

Room.prototype = {

    constructor: Room,

    removeSocket: function (socket) {
        // 1. 从房间中去掉这个 socket
        this.socketList.pop(socket);

        // 2. 将该 socket 的房间拿掉
        socket.$roomList.pop(this);

        // 3. 通知该用户已经断开
        socket.emit('news', {
            content: '你已经离开',
            time: getTime()
        });

        // 4. 通知其他 socket，该用户已经离开
        for (var o in this.socketList) {
            this.socketList[o].emit('news', {
                content: socket.$userName || '对方' + '已经离开',
                time: getTime()
            });
        }

        return Room.RESULT.OK;
    },

    addSocket: function (socket) {
        // 1. 如果满了，就返回错误
        if (this.socketList.length == this.max)
            return Room.RESULT.FULL;

        // 2. 添加这个用户
        this.socketList.push(socket);

        // 3. 断开的话要去掉这个用户
        var room = this;
        socket.on('disconnect', function () {
            room.removeSocket(socket);
        });

        // 4. socket 中加入 room 标识
        socket.$roomList ? socket.$roomList.push(this) : socket.$roomList = [this];

        return Room.RESULT.OK;
    },

    start: function () {
        if (this.socketList.length < 2)
            return Room.RESULT.NOT_ENOUGH_MEMBER;

        for (var o in this.socketList) { // TODO 这里可能有重复安装监听器
            list = this.socketList;
            this.socketList[o].on('send', function (data) {
                if (!data.content)
                    return;
                for (var p in list) {
                    list[p].emit('msg', {
                        content: data.content,
                        sender: this.id
                    })
                }
            });
        }
    }
};

function getTime() {
    return (new Date(os.uptime())).toTimeString().split(' ')[0];
}

exports = module.exports = Room;