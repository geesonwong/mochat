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
    function joined(data) {
        $('.tab.tmp').remove();
        $('.tab.active').removeClass('active');
        $('.panel').hide();

        // 增加 tab
        var roomId = data.roomId;
        var html = template.render('user-tab-tpl', {
            roomId: data.roomId,
            nickname: data.members[0].nickname,
            face: data.members[0].face,
            desc: data.members[0].desc,
            userClass: 'active'
        });
        var tpl = $(html);
        tpl.attr('id', 'tab-' + roomId);
        $('.user-list').append(tpl);

        // 增加 panel
        html = template.render('panel-tpl', {
            nickname: data.members[0].nickname,
            face: data.members[0].face,
            desc: data.members[0].desc,
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
    function leave(data) {
    }

    /**
     * 成功离开聊天
     */
    function left(data) {
        var roomId = data.roomId;
        alert('成功离开聊天');
    }

    /**
     * 接收到通知
     */
    function notice(data) {
        var roomId = data.roomId;
        var content = data.content;
    }

    /**
     * 发送消息
     */
    function send(data) {
        var html = template.render('simple-msg-tpl', {
            color: 'blue',
            nickname: '你',
            time: new Date().toLocaleTimeString(),
            content: data.content
        });
        __appendMsg__(data.roomId, html, true);
    }

    /**
     * 接收到消息
     */
    function receive(data) {
        var roomId = data.roomId;
        var html = template.render('simple-msg-tpl', {
            color: 'brown',
            nickname: data.sender.nickname,
            time: new Date().toLocaleTimeString(),
            content: data.content
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
    function profiled(data) {
    }

    /**
     * 修改自己的资料
     */
    function profile(data) {

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
