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
Room.SYSTEMMESSAGE = '你们可以开始聊天了';
Room.FULL = 4;

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
        } else {
            return Room.FULL;
        }
    },
    removeUser:function (socket) {
        if (socket.__userListId__!==undefined) {
            var _id = socket.__userListId__;
            var userList = this.userList;
            var len;
           // Console.log('离开'+_id);
            userList.splice(_id, 1);

            //正在聊天中离开，必须通知对方
            if((_id==1&&userList[0])||_id==2){
                userList[0].socket.emit('opposite_leave');

            }

            len = userList.length;
           // Console.log('剩下'+len);

            for (; _id < len; _id++) {
               // Console.log('源id'+userList[_id].socket.__userListId__);
                userList[_id].socket.__userListId__--;
              //  Console.log('后来Id'+userList[_id].socket.__userListId__);
            }

            this.startTalk();
        }
    },
    startTalk:function () {
        var user1, user2;
        if (this.userList.length == 2) {
            user1 = this.userList[0];
            user2 = this.userList[1];

            user1.socket.emit('systemMsg', {'sysMsg':Room.SYSTEMMESSAGE});
            user2.socket.emit('systemMsg', {'sysMsg':Room.SYSTEMMESSAGE});

            user1.socket.on('msg', function (data) {
                user2.socket.emit('msg', {'msg':messageHandle(data.msg)});
            });

            user2.socket.on('msg', function (data) {
                user1.socket.emit('msg',  {'msg':messageHandle(data.msg)});
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


exports.Room = Room;
exports.RoomList = RoomList;