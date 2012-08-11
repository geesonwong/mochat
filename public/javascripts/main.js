seajs.use([
    'talk-client',
    'util',
    'jquery-ui',
    'template',
    'mousewheel'

], function (talk, util) {
    var content = $('#content'),
        header = $('#header'),
        poText = $('#po-text'),
        poSubmit = $('#po-submit'),
        faces = $('.faces'),
        board = $('#board'),
        settings = $('.settings'),
        iface = $('#i-face'),
        area = $('area'),
        leave = $('#leave'),
        info = $('.info'),
        dataStorage = util.dataStorage;


    var talkClient = talk.create();

    // my profile
    var i = dataStorage.get('i');
    var setting = dataStorage.get('settings');

    // the other information
    var u = {};
    var room = {};

    if (!i) {
        dataStorage.set('i', {'face':0, 'name':'陌生人', 'introduce':''});
    } else {
        $('#i-face').css('background-position', -parseInt(i.face) * 100 + 'px 0px');
    }

    if (!setting || !$.isEmptyObject(setting)) {
        setting = {
            silence:false,
            desktopNotice:false,
            ctrlPo:false,
            quickPo1:'你好！',
            quickPo2:'很高兴认识你啊，^_^。',
            quickPo3:'聊点别的吧～',
            quickPo4:'嗯嗯，继续说…',
            quickPo5:'拜拜，跟你聊天很开心！'
        };
        dataStorage.set('settings', setting);
    }

    talkClient.msgCallback = function (data) {// 聊天信息
        data.face = parseInt(u.face);
        refreshContent(data);
    };

    talkClient.uEnterRoomCallback = function (data) {
        refreshContent(data,true);
        //todo
    };

    talkClient.opleaveCallback = function (data) {
        refreshContent(data,true);
    };

    talkClient.receiveCallback = function () {

        //todo receive接收到东西后的事件
    };

    talkClient.uProfileCallback = function (data) {
        u = data;
        refreshContext();
    };


    // 渲染对方资料板
    function refreshContext() {
        var html = template.render('info', {
            u:u,
            room:room
        });
        info.html(html);
        $('#u-face').css('background-position', -parseInt(u.face) * 100 + 'px 0px');
    }

    // 模板开始和结束标记重定义，否则跟ejs冲突
    template.openTag = "{%";
    template.closeTag = "%}";

    // 渲染头像
    var areas = template.render('area', {
        count:21
    });
    $(areas).appendTo($('map'));

    /* 下面是事件的函数 */

    // 选择头像滚动滑轮的事件
    function facesMousewheel(event, delta, deltaX, deltaY) {
        faces.scrollLeft(faces.scrollLeft() - faces.width() * 0.2 * delta);
    }

    // “发送”事件
    function send() {
        var msg = poText.val();
        if ($.trim(msg) != '') {
            var data = {'content':msg,
                'time':(new Date()).toTimeString().split(' ')[0],
                'face':i['face'],
                'self':true};
            refreshContent(data);
            talkClient.sendMsg(msg);
            poText.val('');
        }
    }

    // 将message的内容显示在content中
    function refreshContent(message, type) {
        if(type){
            var html = template.render('notice', {
                data:message
            });
        }else{
            var html = template.render('item', {
                data:message
            });
        }
        $(html).appendTo(content);
        content.animate({scrollTop:content[0].scrollHeight - content.height()}, 1000);
    }

    // 打开填写自己的资料的面板
    function showConfig() {
        if ($('#map').css('display') != 'none')
            $('#map').hide('slide', {
                direction:'up'
            }, 200);
        $('#config').toggle('slide', {
            direction:'down'
        }, 200);
    }

    // 打开显示地图的面板
    function showMap() {
        if ($('#config').css('display') != 'none')
            $('#config').hide('slide', {
                direction:'down'
            }, 200);
        $('#map').toggle('slide', {
            direction:'up'
        }, 200);
    }

    // 换头像的事件
    function changeFace(w) {
        var n = isNaN(w) ? $(this).attr("value") : w;
        i['face'] = n;
        dataStorage.set('i', i);
        talkClient.sendProfile(i);
        $('#i-face').css('background-position', -parseInt(n) * 100 + 'px 0px');
    }

    // 打开“设置”
    function openSettings() {
        if (board.dialog('isOpen') != true) {
            board.dialog({
                show:"explode",
                hide:"explode",
                buttons:[
                    {
                        text:'应用',
                        click:function () {

                        }
                    }
                ]
            });
        } else {
            board.dialog('close');
        }
    }

    // 离开和进入房间
    function toggleRoom(event) {
        event.stopPropagation();
        if (talkClient.inRoom) { // 正在聊天
            talkClient.leaveRoom();
            $('#leave').attr('src', '/images/connect.png');
        } else {
            talkClient.enterRoom('11:12');
            $('#leave').attr('src', '/images/leave.png');
            talkClient.sendProfile(i);
        }
    }

    // 发送框按键事件
    function poTextKeyPress(event) {
        if (event.keyCode == 13 && setting.ctrlPo == event.ctrlKey) {
            send();
            return false;
        }
    }

    poSubmit.click(send);
    iface.click(showConfig);
    header.click(showMap);
    $('area').click(changeFace);
    faces.bind('mousewheel', facesMousewheel);
    settings.click(openSettings);
    leave.click(toggleRoom);
    $('#po-text').keypress(poTextKeyPress);

});