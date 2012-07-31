seajs.use([
    'talk-client',
    'jquery',
    'jquery-ui',
    'template'
], function (talk) {
    var content = $('#content'),
        poText = $('#po-text'),
        poSubmit = $('#po-submit'),
        localStorage = window.localStorage;

    if (localStorage.getItem('face') == null){
        localStorage.setItem('face', 0);
        localStorage.setItem('name', '陌生人');
    }else{
        $('#i-face').css('background-position', -parseInt(localStorage.face) * 124 + 'px 0px');
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
        }, //systemCallback
        function () {
            var tmp = '对方已经离开';
            $(tmp).appendTo(content);
        }    //opleaveCallback
    );

    talkClient.enterRoom('11:12');
    poSubmit.click(function () {
        talkClient.sendMsg(poText.val());
        poText.val('');

    });

    // 模板开始和结束标记重定义，否则跟ejs冲突
    template.openTag = "{%";
    template.closeTag = "%}";

    var areas = template.render('area', {
        count:20
    });
    $(areas).appendTo($('map'));

    $('#i-face').click(function () {
        if ($('#map').css('display') != 'none')
            $('#map').hide('drop', {
                direction:'up'
            }, 200);
        $('#config').toggle('drop', {
            direction:'down'
        }, 200);
    });

    $('#header').click(function () {
        if ($('#config').css('display') != 'none')
            $('#config').hide('drop', {
                direction:'down'
            }, 200);
        $('#map').toggle('drop', {
            direction:'up'
        }, 200);
    });

    $('area').click(function () {
        var n = $(this).attr('value');
        localStorage.setItem('face', n);
        $('#i-face').css('background-position', -parseInt(n) * 124 + 'px 0px');
    });


});