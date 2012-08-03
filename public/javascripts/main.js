seajs.use([
    'talk-client',
    'util',
    'jquery-ui',
    'template',
    'mousewheel'

], function (talk, util) {
    var content = $('#content'),
        poText = $('#po-text'),
        poSubmit = $('#po-submit'),
        faces = $('.faces'),
        dataStorage = util.dataStorage;


    var user = dataStorage.get('user');
    if (!user) {
        dataStorage.set('user', {'face':0, 'name':'陌生人'});
    } else {
        $('#i-face').css('background-position', -parseInt(user.face) * 100 + 'px 0px');
    }

    var talkClient = talk.create(
        function (data) {// 聊天信息
            var html = template.render('item', {
                data:data
            });
            $(html).appendTo(content);
        }, //msgCallback
        function (data) {
            var html = template.render('notice', {
                data:data
            });
            $(html).appendTo(content);


            //todo data['oppositeUser'] 获取对方信息
        }, //systemCallback
        function () {
            var tmp = '对方已经离开';
            $(tmp).appendTo(content);
        }    //opleaveCallback
    );


    function facesMousewheel(event, delta, deltaX, deltaY) {


        faces.scrollLeft(faces.scrollLeft() + faces.width() * 0.2 * delta);


    }


    talkClient.enterRoom('11:12');

    poSubmit.click(function () {
        var user = dataStorage.get('user');
        var msg = poText.val();
        if ($.trim(msg) != '') {
            var data = {'msg':msg,
                'time':(new Date()).toTimeString().split(' ')[0],
                'face':user['face'],
                'self':true};

            var html = template.render('item', {
                data:data
            });
            $(html).appendTo(content);

            talkClient.sendMsg(msg);
            poText.val('');
        }

    });

    // 模板开始和结束标记重定义，否则跟ejs冲突
    template.openTag = "{%";
    template.closeTag = "%}";

//    var iFace

    var areas = template.render('area', {
        count:21
    });
    $(areas).appendTo($('map'));

    $('#i-face').click(function () {
        if ($('#map').css('display') != 'none')
            $('#map').hide('slide', {
                direction:'up'
            }, 200);
        $('#config').toggle('slide', {
            direction:'down'
        }, 200);
    });

    $('#header').click(function () {
        if ($('#config').css('display') != 'none')
            $('#config').hide('slide', {
                direction:'down'
            }, 200);
        $('#map').toggle('slide', {
            direction:'up'
        }, 200);
    });

    $('area').click(function () {
        var n = $(this).attr('value');
        var user = dataStorage.get('user');
        user['face'] = n;
        dataStorage.set('user', user);
        $('#i-face').css('background-position', -parseInt(n) * 100 + 'px 0px');
    });
    faces.bind('mousewheel', facesMousewheel);

});