/**
 * mac 样式的装饰器
 */
define(['jquery', 'template'], function (io, template) {
    /**
     * 发起聊天
     */
    function join() {
        console.log('发起了聊天');
        var html = template.render('user-tab-tpl', {
            nickname: '等待中…',
            face: '/image/who.png',
            additions: 'loading',
            userClass: 'tmp'
        });
        $('.user-list').append($(html));
    }

    /**
     * 成功建立聊天
     */
    function joined(roomId, member) {
        $('.tab.tmp').remove();
        $('.tab.active').removeClass('active');
        $('.panel').hide();

        // 增加 tab
        var roomId = roomId;
        var html = template.render('user-tab-tpl', {
            id: member.id,
            roomId: roomId,
            nickname: member.nickname,
            face: member.face,
            desc: member.desc,
            userClass: 'active'
        });
        var tpl = $(html);
        tpl.attr('id', 'tab-' + roomId);
        $('.user-list').append(tpl);

        // 增加 panel
        html = template.render('panel-tpl', {
            id: member.id,
            nickname: member.nickname,
            face: member.face,
            desc: member.desc,
            roomId: roomId
        });
        tpl = $(html);
        tpl.attr('id', 'panel-' + roomId);
        $('.right-panel').append(tpl);
        tpl.show();
    }

    /**
     * 成功离开聊天
     */
    function leave(roomId) {
        $('#tab-' + roomId).remove();
        $('#panel-' + roomId).remove();
    }

    /**
     * 成功离开聊天
     */
    function left(roomId) {
        $('#tab-' + roomId).remove();
        $('#panel-' + roomId).remove();
        receive('admin', {nickname: '抹茶姑娘'}, '已经离开房间哦！');
    }

    /**
     * 接收到通知
     */
    function notice(roomId, content) {
        var roomId = roomId;
        var content = content;
    }

    /**
     * 发送消息
     */
    function send(roomId, content) {
        var html = template.render('simple-msg-tpl', {
            color: 'blue',
            nickname: '你',
            time: new Date().toLocaleTimeString(),
            content: content
        });
        __appendMsg__(roomId, html, true);
    }

    /**
     * 接收到消息
     */
    function receive(roomId, sender, content) {
        var roomId = roomId;
        var html = template.render('simple-msg-tpl', {
            id: sender.id,
            color: 'brown',
            nickname: sender.nickname,
            time: new Date().toLocaleTimeString(),
            content: content
        });
        __appendMsg__(roomId, html, false);
        if (!$('#tab-' + roomId).hasClass('active')) {
            var $additon = $('#tab-' + roomId).find('.addition');
            $additon.addClass('unread');
            var original = $additon.html() || 0;
            $additon.html(parseInt(original) + 1);
        }

    }

    /**
     *  接收别人修改资料的消息
     */
    function profiled(id, nickname, face, desc) {
        $('.nickname-' + id).html(nickname);
        $('.face-' + id).attr('src', face);
        $('.desc-' + id).html(desc);
    }

    /**
     * 修改自己的资料
     */
    function profile() {

    }

    function __appendMsg__(roomId, html, clear) {
        var $chat = $('#chat-' + roomId);
        $chat.append($(html));
        if (clear)
            $('#panel-' + roomId).find('.po textarea').val('');
        $chat.scrollTop($chat[0].scrollHeight - 365);
    }

    return {
        join: join,
        joined: joined,
        leave: leave,
        left: left,
        send: send,
        receive: receive,
        profiled: profiled,
        profile: profile,
        notice: notice
    }
});
