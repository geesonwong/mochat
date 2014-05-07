var path = require('path');

exports = module.exports = {

    dbc: {
        host: '127.0.0.1',
        db: 'mochat',
        port: '27017',
        username: '',
        password: '',
        auto_reconnect: true,

        /*用于程序启动时，数据库自检*/
        collections_count: 1,
        indexes_count: 0
    },

    front: {
        faviconUrl: 'http://cl.man.lv/favicon.ico',//'http://www.morewords.com/favicon.ico',
        randomFace: 'http://avatar.3sd.me/40',
        defaultDesc: '这个人很丑什么都不想说…'
    },

    userConf: {
        maxRoomCount: 5
    }

};