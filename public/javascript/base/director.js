/**
 * 装饰器
 */
define(['jquery', 'template'], function (io, template) {
    /**
     * 发起聊天
     */
    function join() {
        alert('发起了聊天');
    }

    /**
     * 成功建立聊天
     */
    function joined(data) {
        var roomId = data.roomId;
        alert('成功建立聊天');
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
    }

    /**
     * 接收到消息
     */
    function receive(data) {
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

    return {
        ok: function () {
            var html = template.render('simple-msg-tpl', {
                color: 'brown',
                nickname: '陌生人',
                time: '13:09:23',
                content: '人生何处不相逢，相逢何必曾相识。'
            });
            $('#chat-board').append(html);
            $('#chat-board').append(html);
            $('#chat-board').append(html);
            $('#chat-board').append(html);
            $('#chat-board').append(html);
            $('#chat-board').append(html);
            $('#chat-board').append(html);
            $('#chat-board').append(html);
        },
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
