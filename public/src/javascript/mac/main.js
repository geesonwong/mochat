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
        'cookie': 'lib/jquery-plugin/jquery.cookie',
        'director': 'javascript/mac/director',
//        'client': 'javascript/socket-client',
        'util': 'javascript/util'
    }
});

require(['jquery', 'socketio', 'director', 'template'], function ($, socketio, director, template) {

    var self = {
        id: '',
        nickname: '',
        face: '',
        desc: ''
    };

    // ------------- 准备工作 -------------
    template.openTag = '{{';
    template.closeTag = '}}';

    // ------------- socket 专场 -------------
    var socket = socketio.connect(window.location.host);
    var roomIds = [];
    var rooms = {};

    // 1. 给 socket 安装各类监听器
    (function () {
        var director = require('director');
        // 进入房间
        socket.on('join', function (data) {
            if (!data.isSuccess)
                return;
            self.id = data.id;
            console.log('房间号' + data.roomId);
            rooms[data.roomId] = {};
            roomIds.push(data.roomId);
            var member;
            for (var i in data.members) {
                if (data.members[i].id != self.id) {
                    member = data.members[i];
                    break;
                }
            }
            director.joined(data.roomId, member);
        });
        // 退出房间
        socket.on('leave', function (data) {
            console.log('房间号' + data.roomId);
            var index = roomIds.indexOf(data.roomId);
            roomIds.splice(index);
            director.left(data.roomId);
        });
        // 接收消息
        socket.on('msg', function (data) {
            console.log('房间号' + data.roomId);
            console.log('内容是' + data.content);
            console.log('时间是' + data.time);
            console.log('发送者' + data.sender);
            director.receive(data.roomId, data.sender, data.content);
        });
        // 接收通知
        socket.on('notice', function (data) {
            console.log('房间号' + data.roomId);
            console.log('内容是' + data.content);
            console.log('时间是' + data.time);
            director.notice({roomId: data.roomId});
        });
        // 收到资料改变的信息
        socket.on('profile', function (data) {
            console.log('id是' + data.id);
            console.log('nickname是' + data.nickname);
            console.log('face是' + data.face);
            console.log(('desc是' + data.desc));
            director.profiled(data.id, data.nickname, data.face, data.desc);
        });
    })();

    // 2. 各种 socket 的方法
    var client = {
        join: function join() {
            socket.emit('join');
            director.join();
        },
        leave: function leave(roomId) {
            socket.emit('leave', {
                roomId: roomId
            });
            director.leave(roomId);
        },
        send: function send(roomId, content) {
            if (!roomId || !content)
                director.alert({content: '刷新页面重试'});
            if (content.trim() == '')
                return;
            socket.emit('msg', {
                roomId: roomId,
                content: content
            });
            director.send(roomId, content);
        },
        profile: function profile(nickname, face, desc) {
            socket.emit('profile', {
                nickname: nickname,
                face: face,
                desc: desc
            });
            director.profile();
        }
    };

    // ------------- 绑定各种事件 -------------

    // 0. 页面初始化
    (function () {
        // 加载抹茶姑娘的 tab 和 panel
        var roomId = 'admin';
        var nickname = '抹茶姑娘';
        var face = 'http://tp1.sinaimg.cn/2862820140/50/5691239858/0';
        var desc = '欢迎来到抹茶，希望我能给你一段欢乐时间';
        var html = template.render('user-tab-tpl', {
            roomId: roomId,
            nickname: nickname,
            face: face,
            desc: '欢迎来到抹茶，希望我能给你一段欢乐时间',
            userClass: 'active'
        });
        var tpl = $(html);
        tpl.attr('id', 'tab-' + roomId);
        $('.user-list').append(tpl);
        html = template.render('panel-tpl', {
            nickname: nickname,
            face: face,
            desc: desc,
            roomId: roomId
        });
        tpl = $(html);
        tpl.attr('id', 'panel-' + roomId);
        $('.right-panel').append(tpl);
        tpl.show();
        // 加载抹茶姑娘的对话
        director.receive(roomId, {nickname: '抹茶姑娘'}, '很高兴能见到你来抹茶跟大家聊天！');
    })();

    // 1. join 按钮
    $('#join').click(function () {
        client.join();
    });
    // 2. 回复框回车事件
    $('.right-panel').delegate('.po textarea', 'keydown', function (event) {
        if (event.keyCode == 13 && event.ctrlKey == false) {
            var roomId = $(event.currentTarget).parent().parent().attr('room-id');
            var content = $(event.currentTarget).val();
            client.send(roomId, content);
            event.preventDefault();
        }
        return;
    });
    // 3. 点击 tab 切换
    $('.user-list').delegate('.tab', 'click', function (event) {
        var roomId = $(event.currentTarget).attr('room-id');
        if (!roomId)
            return;
        // 隐藏所有的 tab 和 panel
        $('.tab.active').removeClass('active');
        $('.panel').hide();
        // 显示指定的
        $('#tab-' + roomId).addClass('active');
        $('#panel-' + roomId).show();
        $('#chat-' + roomId).scrollTop($('#chat-' + roomId)[0].scrollHeight - 365);
        // 清除标记
        var $additon = $('#tab-' + roomId).find('.addition');
        $additon.removeClass('unread');
        $additon.html('');
    });
    // 4. 点击 profile 按钮切换
    $('#i-profile').click(function () {
        if ($('#profile-setting').hidden()) {
            // 隐藏当前 tab 和 panel
            $('.tab.active').removeClass('active');
            $('.panel').hide();
            $('#tab-admin').addClass('active');
            $('#profile-setting').show();
        }
    });
    // 5. 给 admin 面板添加一些特殊功能
    $('#panel-admin').delegate('.po textarea', 'keydown', function (event) {
        if (event.keyCode == 13 && event.ctrlKey == false) {
            var content = $(event.currentTarget).val();
            if (!content || content.trim() == '')
                return;
            var nickname, desc, face;
            var regNickname = /@[\u4e00-\u9fa5\w]{2,10}/;
            var regDesc = /#[\u4e00-\u9fa5\w]{2,}/;
            var regFace = /!(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?\.(jpg|gif|png)/;
            if (regNickname.test(content))
                nickname = regNickname.exec(content)[0].substr(1);
            if (regDesc.test(content))
                desc = regDesc.exec(content)[0].substr(1);
            if (regFace.test(content))
                face = regFace.exec(content)[0].substr(1);
            client.profile(nickname, face, desc);
            var profile = {nickname: nickname, face: face, desc: desc};
            for (var i in profile) {
                if (!profile[i])
                    continue;
                var tmp = '啊，好的嘛！你的';
                switch (i) {
                    case 'nickname':
                        tmp += '昵称将改为';
                        break;
                    case 'face':
                        tmp += '头像地址将改为';
                        break;
                    case 'desc':
                        tmp += '个人介绍将改为';
                        break;
                }
                director.receive('admin', {nickname: '抹茶姑娘'}, tmp + profile[i]);
            }
            event.preventDefault();
        }
        return;
    });
    // 6. leave 按钮
    $('.right-panel').delegate('.leave', 'click', function (event) {
        var roomId = $(event.currentTarget).attr('room-id');
        client.leave(roomId);
    });
});