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
            socket.on('oppositeLeave', function (data) {
                //todo 对方离开的处理
                that.opleaveCallback(data);
            });

            socket.on('systemMsg', function (data) {
                that.talking = true;
                //todo 显示系统消息和通知已开始对话
                that.systemCallback(data)
            });

            socket.on('msg', function (data) {
                //todo 接到消息 msg
                that.msgCallback(data);
                socket.emit('receive');

            });

            socket.on('receive',function(){
                that.receiveCallback();
            });

            socket.emit('information', {'position':position});
        },

        leaveRoom:function () {
            this.socket && this.socket.disconnect();
            this.talking = false;

        },

        sendMsg:function (msg) {
            if (this.talking) {
                this.socket.emit('msg', {'msg':msg});
                return true;
            } else {
                return false;
            }
        }

    };

    module.exports = {
        create:function (msgCallback, systemCallback, opleaveCallback) {
            return new Talk(msgCallback, systemCallback, opleaveCallback);
        }
    };
});

