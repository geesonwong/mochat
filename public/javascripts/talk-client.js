/**
 * Created with JetBrains WebStorm.
 * User: czy
 * Date: 12-7-28
 * Time: 下午5:49
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
    require('socket.io');
    var dataStorage = require('util').dataStorage;


    function Talk() {
        this.sio = io;
        this.server = 'http://kailiaoba.info:3000';
        this.socket = null;
        this.talking = false;
        this.inRoom = false;
        this.msgCallback = null;
        this.uEnterRoomCallback = null;
        this.opleaveCallback = null;
        this.receiveCallback = null;
        this.uProfileCallback = null;
    }

    Talk.prototype = {

        enterRoom:function (position) {
            var socket;
            var that = this;

           if(!this.socket) {
               socket =  this.socket = this.sio.connect(this.server);
               socket.on('global.uLeaveRoom', function (data) {
                   //todo 对方离开的处理
                   console.log(data);

                   that.opleaveCallback(data);
               });

               socket.on('global.uEnterRoom', function (data) {
                   that.talking = true;
                   //todo 对方进入房间，并开始聊天
                   that.uEnterRoomCallback(data)
               });

               socket.on('session.receiveMessage', function (data) {
                   //todo 接到消息 msg
                   that.msgCallback(data);
                   socket.emit('session.responsee');

               });

               socket.on('session.response', function (data) {
                   //todo 对方已经收到你的消息
                   that.receiveCallback(data);
               });

               socket.on('session.uProfile', function (data) {
                   that.uProfileCallback(data);
               });
           }
            else{
               socket=this.socket;
               socket.socket.connect();
           }




    that.inRoom = true;




    socket.emit('global.iEneterRoom', {'position':position});



        },

        leaveRoom:function () {
            this.inRoom = false;
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
        },

        sendProfile:function (data) {
            dataStorage.set('i', data);
            socket.emit('session.iProfile', data);
        }

    }
    module.exports = {
        create:function () {
            return new Talk();
        }
    };
});

