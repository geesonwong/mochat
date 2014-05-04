var express = require('express')
    , path = require('path')
    , configs = require('../config');

var storeMemory = new express.session.MemoryStore({
    reapInterval: 60000 * 10
});

/**
 * 配置 express
 */
exports = module.exports = function (app) {


    app.configure('dev', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        app.use(express.static(path.join(__dirname, '/../public/src')));
    });

    app.configure(function () {
        app.set('port', process.env.PORT || 18080);
        app.set('views', __dirname + '/../views');
        app.set('view engine', 'html');
        app.set('view cache', true);

        app.engine('html', require('ejs').renderFile);

        app.use(express.logger('dev')); // 日志
        app.use(express.compress()); // 压缩
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.cookieParser('air'));
        app.use(express.methodOverride());
        app.use(express.session({store: storeMemory, secret: 'mo9c9h6at'}));
        app.use(express.static(path.join(__dirname, '/../public/dist')));
        app.use(express.csrf());
        app.use(express.errorHandler());
    });

    app.configure('dev', function () {
        app.set('view cache', false);
    });

    console.log('env:' + process.env.NODE_ENV);
    console.log('view cache:' + app.get('view cache'));

    // 应用的常量，可以在模板中直接取到值
    app.locals({
    });

};
