/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , io = require('socket.io')
    , MemoryStore = express.session.MemoryStore
    , parseCookie = require('express/node_modules/cookie').parse
    , talkModule = require('./controllers/talk.js')
    , RoomList = talkModule.RoomList;
// ,Room=talkModule.Room;

var storeMemory = new MemoryStore({
    reapInterval:60000 * 10
});

var roomlist = new RoomList();

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('air'));
    app.use(express.session({store:storeMemory}));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

// 应用的常量，可以在模板中直接取到值
app.locals({
    const:{
    }
});

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("服务器已启动，监听端口号：" + app.get('port'));
});

// socket.io
io = io.listen(server);


io.set('authorization', function (handshakeData, callback) {
    // 通过客户端的cookie字符串来获取其session数据

    if (handshakeData.headers.cookie) {
        handshakeData.cookie = parseCookie(handshakeData.headers.cookie);
        var connect_sid = handshakeData.cookie['connect.sid'];//.slice(0, val.lastIndexOf('.'))
        connect_sid = connect_sid.indexOf('s:') >= 0 ? connect_sid.slice(2, connect_sid.lastIndexOf('.')) : connect_sid;
        console.log(connect_sid);
        if (connect_sid) {
            storeMemory.get(connect_sid, function (error, session) {
                if (error) {
                    // if we cannot grab a session, turn down the connection
                    callback(error.message, false);
                }
                else {
                    // save the session data and accept the connection
                    handshakeData.session = session;
                    callback(null, true);
                }
            });
        }
        else {
            callback('nosession');
        }
    } else {
        //  callback('nocookie');
        callback(null, true);
    }
});

io.sockets.on('connection', function (socket) {
    var user;
//    if(socket.handshake.session){
//        user= socket.handshake.session.user;
//        user.socket=socket;
//    }

    var cookie = parseCookie(socket.handshake.headers.cookie);
    user = cookie['user'];
    if (user) {
        //parseCookie的返回值不能写
        user = {'face':user.face, 'name':user.name};
    } else {
        user = {'face':0, 'name':'陌生人'}
    }

    user.socket = socket;
    socket.on('global.iEneterRoom', function (data) {
        roomlist.enter(user, data['position']);
    })


});
