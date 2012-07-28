/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

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
  app.use(express.session());
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

http.createServer(app).listen(app.get('port'), function () {
  console.log("服务器已启动，监听端口号：" + app.get('port'));
});

// socket.io
io = io.listen(app);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello:'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
