require.config({
    shim: {
        'socketio': {
            exports: 'io'
        }
    },
    baseUrl: '/',
    paths: {
        'jquery': 'lib/jquery/jquery-1.11.0.min',
        'jqueryui': 'lib/jquery-ui/js/jquery-ui-1.10.4.custom.min',
        'socketio': 'lib/socket-io/socket.io',
        'template': 'lib/template/template',
        'director': 'javascript/base/director',
        'cookie': 'lib/jquery-plugin/jquery.cookie',
        'util': 'javascript/util'
    }
});

require(['jquery', 'socketio', 'director', 'template'], function ($, socketio, director, template) {

    // ------------- 准备工作 -------------
    template.openTag = '{{';
    template.closeTag = '}}';

    // ------------- socket 专场 -------------
    var socket = socketio.connect(window.location.host);
    var roomIds = [];
    var rooms = {};

    // 1. 给 socket 安装各类监听器
    (function () {
        // 进入房间
        socket.on('joined', function (data) {
            console.log('房间号' + data.roomId);
            rooms[data.roomId] = {};
            roomIds.push(data.roomId);
            director.joined({roomId: data.roomId, members: data.members});
        });
        // 退出房间
        socket.on('left', function (data) {
            console.log('房间号' + data.roomId);
            var index = roomIds.indexOf(data.roomId);
            roomIds.splice(index);
            director.left({roomId: data.roomId})
        });
        // 接收消息
        socket.on('receive', function (data) {
            console.log('房间号' + data.roomId);
            console.log('内容是' + data.content);
            console.log('时间是' + data.time);
            console.log('发送者' + data.sender);
            director.receive({roomId: data.roomId})
        });
        // 接收通知
        socket.on('notice', function (data) {
            console.log('房间号' + data.roomId);
            console.log('内容是' + data.content);
            console.log('时间是' + data.time);
            director.notice({roomId: data.roomId})
        });
        // 收到资料改变的信息
        socket.on('profiled', function (data) {
            console.log('id是' + data.id);
            console.log('nickname是' + data.nickname);
            console.log('face是' + data.face);

        });
    })();

    director.ok();

    // 2. 各种 socket 的方法
    function join() {
        socket.emit('join');
        director.join();
    }

    function leave(roomId) {
        socket.emit('leave', {
            roomId: roomId
        });
        director.leave();
    }

    function send(roomId, content) {
        socket.emit('send', {
            roomId: roomId,
            content: content
        });
        director.send();
    }

    function profile(nickname, face) {
        socket.emit('profile', {
            nickname: nickname,
            face: face
        });
        director.profile();
    }

});