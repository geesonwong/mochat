var os = require('os');

var prepareRooms = [];

function User(socket, info) {
    this.socket = socket;
    this.info = info;
}


function Room(position, name, mode, max) {
    this.position = position;
    this.userList = [];
    this.name = name;
    this.mode = mode ? mode : 0;
    this.max = max ? max : 1000;
}

Room.STAER = 1;
Room.WAIT_TOMANY = 2;
Room.WAIT_LACKUSER = 3;
Room.FULL = 4;

Room.SYSTEMMESSAGE = '你们可以开始聊天了';
Room.SYSTEMMESSAGE_LEAVE = '对方已经离开';

Room.MODE = {
    P2P:0, //双人聊天
    CLUB:1, //多人聊天
    MEETING:2 //招待会（实际上就是一个人跟多个人聊天）
};

Room.prototype = {
    constructor:Room,
    addUser:function (user) {
        if (this.userList.length < this.max) {
            var length = this.userList.push(user);
            user.socket.__userListId__ = length - 1;

            var room = this;
            user.socket.on('disconnect', function () {
                room.removeUser(this);
            });

            if (length > 2) {
                return Room.WAIT_TOMANY;
            } else {
                return this.startTalk();
            }

            if (length == 1) {
                prepareRooms.push();
            }

        } else {
            return Room.FULL;
        }
    },

    removeUser:function (socket) {
        if (socket.__userListId__ !== undefined) {
            var _id = socket.__userListId__;
            var userList = this.userList;
            var len, i;

            userList.splice(_id, 1);

            //正在聊天中离开，必须通知对方

            len = userList.length;
            i = _id;

            for (; i < len; i++) {
                userList[_id].socket.__userListId__--;
            }

            if (len == 1) {
                prepareRooms.push();
            }

            if ((_id == 0 && userList[0]) || _id == 1) {
                userList[0].socket.emit('global.uLeaveRoom', {
                    'content':Room.SYSTEMMESSAGE_LEAVE,
                    'time':getTime()
                });
            }

            this.startTalk();
        }
    },

    startTalk:function () {
        var user1, user2;
        if (this.userList.length == 2) {
            user1 = this.userList[0];
            user2 = this.userList[1];

            user1.socket.emit('global.uEnterRoom', {
                'content':Room.SYSTEMMESSAGE,
                'time':getTime()
            });
            user2.socket.emit('global.uEnterRoom', {
                'content':Room.SYSTEMMESSAGE,
                'time':getTime()
            });

            //系统发送对方资料给你
            user2.socket.emit('session.uProfile', {
                'name':user1.name,
                'introduce':user1.introduce,
                'face':user1.face
            });
            user1.socket.emit('session.uProfile', {
                'name':user2.name,
                'introduce':user2.introduce,
                'face':user2.face
            });

            user1.socket.on('session.iProfile', function (data) {
                user2.socket.emit('session.uProfile', data);

            });

            user2.socket.on('session.iProfile', function (data) {
                user1.socket.emit('session.uProfile', data);
            });


            user1.socket.on('session.response', function () {
                user2.socket.emit('session.response');

            });

            user2.socket.on('session.response', function () {
                user1.socket.emit('session.response');
            });

            user1.socket.on('session.sendMessage', function (data) {
                user2.socket.emit('session.receiveMessage', {
                    'content':messageHandle(data.content),
                    'time':getTime()
                });
            });

            user2.socket.on('session.sendMessage', function (data) {
                user1.socket.emit('session.receiveMessage', {
                    'content':messageHandle(data.content),
                    'time':getTime()
                });
            });

            return Room.STAER;
        } else {
            return Room.WAIT_LACKUSER;
        }
    }


}

function RoomList() {
    this.roomMap = {};
    this.init();
}

RoomList.EXIST = 1;
RoomList.SUCCESS = 2;
RoomList.NOFAND = 3;


RoomList.prototype = {
    constructor:RoomList,
    add:function (position, name, mode, max) {
        if (!this.roomMap[position]) {
            this.roomMap[position] = new Room(position, name, mode, max);
            return RoomList.SUCCESS;
        } else {
            return RoomList.EXIST;
        }
    },
    remove:function (position) {
        this.roomMap[position] = undefined;
    },
    enter:function (user, position) {
        console.log('===' + getTime() + user + ' enter');
        var room = this.roomMap[position];
        if (room) {
            return room.addUser(user);
        } else {
            return RoomList.NOFAND;
        }
    },
    init:function () {
        this.add('11:12');
    }
}


function messageHandle(message) {
    //:todo 对话数据处理
    return message;
}


function getTime() {
    return (new Date(os.uptime())).toTimeString().split(' ')[0];
}


exports.Room = Room;
exports.RoomList = RoomList;