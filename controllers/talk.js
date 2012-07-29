/**
 * Created with JetBrains WebStorm.
 * User: czy
 * Date: 12-7-28
 * Time: 下午1:23
 * To change this template use File | Settings | File Templates.
 */
function User(socket, info) {
    this.socket = socket;
    this.info = info;
}


function Room(position, max) {
    this.position = position;
    this.userList = [];
    this.max = max ? max : 1000;


}
Room.STAER = 1;
Room.WAIT_TOMANY = 2;
Room.WAIT_LACKUSER = 3;
Room.SYSYTEMMESSAGE = '你们可以开始聊天了';
Room.FULL = 4;

Room.prototype = {
    constructor:Room,
    addUse:function (user) {
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
        } else {
            return Room.FULL;
        }
    },
    removeUser:function (socket) {
        if (socket.__userListId__) {
            var _id = socket.__userListId__;
            var userList = this.userList;
            var len;
            userList.splice(_id, 1);
            len = userList.length;

            for (; _id < len; _id++) {
                userList[_id].socket.__userListId__--;
            }
        }
    },
    startTalk:function () {
        var user1, user2;
        if (this.userList.length == 2) {
            user1 = this.userList[0];
            user2 = this.userList[1];

            user1.socket.emit('msg', Room.SYSYTEMMESSAGE);
            user2.socket.emit('msg', Room.SYSYTEMMESSAGE);

            user1.socket.on('msg', function (message) {
                user2.socket.emit('msg', messageHandle(message));
            });

            user2.socket.on('msg', function (message) {
                user1.socket.emit('msg', messageHandle(message));
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

//RoomState = {
//    EXIST : 1,
//    SUCCESS : 2,
//    NOFAND : 3
//}

RoomList.EXIST = 1;
RoomList.SUCCESS = 2;
RoomList.NOFAND = 3;


RoomList.prototype = {
    constructor:RoomList,
    add:function (position, max) {
        if (!this.roomMap[position]) {
            this.roomMap[position] = new Room(position, max);
            return RoomList.SUCCESS;
        } else {
            return RoomList.EXIST;
        }
    },
    remove:function (position) {
        this.roomMap[position] = undefined;
    },
    enter:function (user, position) {
        var room = this.roomMap[position];
        if (room) {
            return room.addUse(user);
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


exports.Room = Room;
exports.RoomList = RoomList;