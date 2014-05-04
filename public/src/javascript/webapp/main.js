require.config({
    shim: {
        'socketio': {
            exports: 'io'
        },
        'iscroll': {
            exports: 'iscroll'
        }
    },
    baseUrl: '/',
    paths: {
        'jquery': 'lib/jquery/jquery-1.11.0.min',
        'socketio': 'lib/socket-io/socket.io',
        'template': 'lib/template/template',
        'bootstrap': 'lib/bootstrap/js/bootstrap.min',
        'iscroll': 'lib/iscroll/iscroll'
    }
});

require(['jquery', 'socketio', 'template', 'iscroll', 'bootstrap'], function ($, socketio, template) {

    // 组件常量
    var $board = $('#scroll .content-reply-box');
    var $po = $('#po-txt');
    var $poButton = $('#po-btn');
    var $reconnect = $('#reconnect');
    var scroll;

    // template
    template.openTag = '{{';
    template.closeTag = '}}';
    var self = {
        id: '',
        nickName: '',
        face: '',
        desc: ''
    };

    // ------------- socket 专场 -------------
    var socket = socketio(window.location.host);
    var roomId , member;

    // 1. 给 socket 安装各类监听器
    (function () {
        // 进入房间
        socket.on('join', function (data) {
            if (!data.isSuccess)
                return;
            console.log('房间号' + data.roomId);
            self.id = data.id;
            roomId = data.roomId;
            for (var i in data.members) {
                if (data.members[i].id != self.id) {
                    member = data.members[i];
                } else {
                    self = data.members[i];
                }
            }
            $board.html(''); // 清理
            scroll.refresh();
            appendNotice('可以开始聊天啦'); // 通知开始聊天
            $po.prop('disabled', false);
            $poButton.prop('disabled', false);
            $reconnect.prop('disabled', false);
        });
        // 退出房间
        socket.on('leave', function (data) {
            console.log('房间号' + data.roomId);
            roomId = null;
            member = null;
            appendNotice('你已经离开房间'); // 通知开始聊天
            $po.prop('disabled', true);
            $poButton.prop('disabled', true);
            $reconnect.prop('disabled', false);
            disconnectclk();
        });
        // 接收消息
        socket.on('msg', function (data) {
            console.log('房间号' + data.roomId);
            console.log('内容是' + data.content);
            console.log('时间是' + data.time);
            console.log('发送者' + data.sender);
            appendMsg('odd', member.id, member.face, member.nickName, data.content);
        });
        // 接收通知
        socket.on('notice', function (data) {
            console.log('房间号' + data.roomId);
            console.log('内容是' + data.content);
            console.log('时间是' + data.time);
            appendNotice(data.content); // 通知开始聊天
        });
    })();

    // 2. 主动
    var client = {
        join: function join() {
            socket.emit('join');
        },
        leave: function leave() {
            socket.emit('leave', {
                roomId: roomId
            });
        },
        msg: function msg(content) {
            socket.emit('msg', {
                roomId: roomId,
                content: content
            });
            appendMsg('even', self.id, self.face, self.nickName, content); // 添加内容到板上
            $po.val('');
            $po.focus();
        }
    };

    // ------------- 监听器 专场 -------------
    // 3. 监听器
    // 发送内容
    $poButton.click(function () {
        var content = $po.val();
        if (content.trim() == "")
            return;
        client.msg(content); // 发送消息
    });
    $po.keydown(function (event) {
        if (event.keyCode == 13 && event.ctrlKey == false) {
            var content = $po.val();
            if (content.trim() == "")
                return;
            client.msg(content); // 发送消息
        }
    });
    $reconnect.click(function () {
        $reconnect.prop('disabled', true);
        if ($reconnect.hasClass('connect')) { // 主动连接
            client.join();
            connectclk();
            appendNotice('爷稍等，奴正在给你找一个人陪聊');
        } else { // 主动断开
            client.leave();
            disconnectclk();
        }
    });
    window.onbeforeunload = function () {
        return false;
    };
//    $po.focus(function () {
//        $('.header').hide();
//    });
//    $po.blur(function () {
//        $('.header').show();
//    });

    // 3. 其他方法
    function disconnectclk() {
        $reconnect.removeClass('disconnect');
        $reconnect.addClass('connect');
        $reconnect.html('连接');
    }

    function connectclk() {
        $reconnect.removeClass('connect');
        $reconnect.addClass('disconnect');
        $reconnect.html('断开');
    }

    function appendNotice(content) {
        var html = template.render('note-tpl', {
            content: content
        });
        $board.append($(html));
        scroll.refresh();
        scroll.scrollToElement('#scroll .content-reply-box li:last-child');
    }

    function appendMsg(who, id, face, nickName, content) {
        var html = template.render('msg-tpl', {
            who: who,
            id: id,
            face: face,
            nickName: nickName,
            content: content
        });
        $board.append($(html));
        scroll.refresh();
        scroll.scrollToElement('#scroll .content-reply-box li:last-child');
    }

    (function () {
        // iScroll 滑动
        scroll = new IScroll('#wrapper', { mouseWheel: true, click: true });
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);

        appendNotice('嗨，欢迎来到爱抹茶，点击右上角的连接，你将随机找到一个陌生人跟你聊天哦，祝聊的开心！😚😚');
        appendNotice('👀 对了对了，刷新或者关闭页面都会断开连接，并丢失所有的聊天信息，爷请谨慎操作啊~');
    })();

});