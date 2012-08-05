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
        info = $('.info'),
        dataStorage = util.dataStorage;

    // my profile
    var i = dataStorage.get('i');

    // the other user profile
    var u = {};
    var room = {};

    if (!i) {
        dataStorage.set('i', {'face':0, 'name':'陌生人'});
    } else {
        $('#i-face').css('background-position', -parseInt(i.face) * 100 + 'px 0px');
    }

//    var talkClient = talk.


    var talkClient = talk.create(
        function (data) {// 聊天信息
            var html = template.render('item', {
                data:data
            });
            $(html).appendTo(content);
        }, //msgCallback
        function (data) {
            var html = template.render('notice', {
                sysMsg:data.sysMsg
            });
            $(html).appendTo(content);
            u = data.oppositeUser;
            room = data.room;
            refreshContext();
            //todo data['oppositeUser'] 获取对方信息
        }, //systemCallback
        function (data) {
            var html = template.render('notice',{
                sysMsg:data.sysMsg
            });
            $(html).appendTo(content);
        }, //opleaveCallback
        function () {
            //todo receive接收到东西后的事件
        }
    );

    talkClient.enterRoom('11:12');


    // 渲染对方资料板
    function refreshContext() {
        var html = template.render('info', {
            u:u,
            room:room
        });
        info.html(html);
        $('#u-face').css('background-position', -parseInt(u.face) * 100 + 'px 0px');
    };

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
    };

    // “发送”事件
    function send(){
        var i = dataStorage.get('i');
        var val = poText.val();
        var msg = val;
        if ($.trim(msg) != '') {
            var data = {'msg':msg,
                'time':(new Date()).toTimeString().split(' ')[0],
                'face':i['face'],
                'self':true};

            var html = template.render('item', {
                data:data
            });
            $(html).appendTo(content);

            talkClient.sendMsg(msg);
            poText.val('');
        }
    };

    // 打开填写自己的资料的面板
    function showConfig() {
        if ($('#map').css('display') != 'none')
            $('#map').hide('slide', {
                direction:'up'
            }, 200);
        $('#config').toggle('slide', {
            direction:'down'
        }, 200);
    };

    // 打开显示地图的面板
    function showMap() {
        if ($('#config').css('display') != 'none')
            $('#config').hide('slide', {
                direction:'down'
            }, 200);
        $('#map').toggle('slide', {
            direction:'up'
        }, 200);
    };

    // 换头像的事件
   function changeFace(w) {
        var n = isNaN(w) ? $(this).attr("value") : w;
        var i = dataStorage.get('i');
        i['face'] = n;
        dataStorage.set('i', i);
        $('#i-face').css('background-position', -parseInt(n) * 100 + 'px 0px');
    };

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
    };


    poSubmit.click(send);
    iface.click(showConfig);
    header.click(showMap);
    $('area').click(changeFace);
    faces.bind('mousewheel', facesMousewheel);
    settings.click(openSettings);


});