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

    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/../views');
        app.set("view options", {favicon: configs.front.faviconUrl});
        app.set('view engine', 'html');
        app.engine('html', require('ejs').renderFile);

        app.use(express.logger('dev')); // 日志
        app.use(express.compress()); // 压缩
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.favicon());
        app.use(express.cookieParser('air'));

        app.use(express.methodOverride());
        app.use(express.session({store: storeMemory, secret: 'mo9c9h6at'}));
        app.use(express.static(path.join(__dirname, '/../public')));
        app.use(express.csrf());
    });

    app.configure('dev', function () {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('prod', function () {
        app.set('view cache', true);
        app.use(express.errorHandler());
    });

    // 应用的常量，可以在模板中直接取到值
    app.locals({
        const: {
        }
    });

};
