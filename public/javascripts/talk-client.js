/**
 * Created with JetBrains WebStorm.
 * User: czy
 * Date: 12-7-28
 * Time: 下午5:49
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    function Talk(msgCallback,systemCallback,opleaveCallback){
    this.sio= require('socket.io');
    this.server='http://localhost:3000';
    this.socket=null;
    this.talking=false;
    this.msgCallback=msgCallback;
    this.systemCallback=systemCallback;
    this.opleaveCallback=opleaveCallback;
    }

    Talk.prototype={

        enterRoom:function(position){
            var socket=this.socket;
            socket||(socket=this.sio.connect(server));
            socket.on('opposite_leave',function(){
               //todo 对方离开的处理
            this.opleaveCallback();
            });

            socket.on('systemMsg',function(msg){
                talking=true;
                //todo 显示系统消息和通知已开始对话
                this.systemCallback(msg)
            });

            socket.on('msg',function(msg){
                //todo 接到消息 msg
                this.msgCallback(msg);
            });

            socket.emit('room_position',position);
        },

        leaveRoom:function(){
            this.socket&&this.socket.disconnect();
            this.talking=false;

        },

        sendMsg:function(msg){
            if(this.talking){
                this.socket.emit('msg',msg);
                return true;
            }else{
                return false;
            }
        }

    }
    module.exports = {
        create:function(msgCallback,systemCallback,opleaveCallback){
            return new Talk(msgCallback,systemCallback,opleaveCallback);
        };
    };
});

