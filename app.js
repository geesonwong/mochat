var express = require('express')
    , http = require('http')
    , path = require('path')

    , route = require('./lib/route')
    , socket = require('./lib/socket')

    , MemoryStore = express.session.MemoryStore

    ;

//    , parseCookie = require('express/node_modules/cookie').parse
//    , talkModule = require('./controller/talk.js')
//    , RoomList = talkModule.RoomList;
// ,Room=talkModule.Room;

var storeMemory = new MemoryStore({
    reapInterval: 60000 * 10
});

//var roomlist = new RoomList();

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
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
    app.use(express.static(path.join(__dirname, 'public')));
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

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("服务器已启动，监听端口号：" + app.get('port'));
});

// 路由
route(app);

// socket.io
socket(server);

