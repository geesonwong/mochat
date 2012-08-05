/**
 * Created with JetBrains WebStorm.
 * User: czy
 * Date: 12-7-28
 * Time: 下午5:49
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    require('socket.io');




    function Talk(msgCallback, systemCallback, opleaveCallback,receiveCallback) {
        this.sio = io;
        this.server = 'http://localhost:3000';
        this.socket = null;
        this.talking = false;
        this.msgCallback = msgCallback;
        this.systemCallback = systemCallback;
        this.opleaveCallback = opleaveCallback;
        this.receiveCallback=receiveCallback;
    }

    Talk.prototype = {

        enterRoom:function (position) {
            var socket;
            socket = this.socket || (this.socket = this.sio.connect(this.server));

            var that = this;//
            socket.on('global.uLeaveRoom', function (data) {
                //todo 对方离开的处理
                that.opleaveCallback(data);
            });

            socket.on('global.uEnterRoom', function (data) {
                that.talking = true;
                //todo 对方进入房间，并开始聊天
                that.systemCallback(data)
            });

            socket.on('session.receiveMessage', function (data) {
                //todo 接到消息 msg
                that.msgCallback(data);
                socket.emit('session.responsee');

            });

            socket.on('session.response',function(data){
                //todo 对方已经收到你的消息
                that.receiveCallback(data);
            });

            socket.emit('global.iEneterRoom', {'position':position});
        },

        leaveRoom:function () {
            this.socket && this.socket.disconnect();
            this.talking = false;

        },

        sendMsg:function (msg) {
            if (this.talking) {
                this.socket.emit('session.sendMessage', {'content':msg});
                return true;
            } else {
                return false;
            }
        }

    }
    module.exports = {
        create:function (msgCallback, systemCallback, opleaveCallback) {
            return new Talk(msgCallback, systemCallback, opleaveCallback);
        }
    };
});

