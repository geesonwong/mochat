seajs.use([
    'talk-client',
    'util',
    'jquery-ui',
    'template',
    'mousewheel'
], function (talk, util) {
    var
        dataStorage = util.dataStorage;

    // 模板开始和结束标记重定义，否则跟ejs冲突
    template.openTag = "{%";
    template.closeTag = "%}";

    // get the default value from locastorage(cookies)
    var i = dataStorage.get('i'),
        settings = dataStorage.get('settings');

    // the other information
    var u = {};
    var room = {};

    // information initial
    function init() {
        if (!i) {
            i = {'face':'http://tp1.sinaimg.cn/1625070192/50/5626596604/1', 'name':'陌生人', 'introduce':''};
        } else {
            $('#i-profile img').attr('src', i.face);
        }
        if (!settings || !$.isEmptyObject(settings)) {
            settings = {
                silence:false,
                desktopNotice:false,
                ctrlPo:false,
                quickPo1:'你好！',
                quickPo2:'很高兴认识你啊，^_^。',
                quickPo3:'聊点别的吧～',
                quickPo4:'嗯嗯，继续说…',
                quickPo5:'拜拜，跟你聊天很开心！'
            };
        }

    }

    // save info to datastorage when tab/window closed
    $(window).unload(function () {
        dataStorage.set('settings', settings);
        dataStorage.set('i', i);
    });

    init();

});