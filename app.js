var express = require('express')
    , http = require('http')
    , route = require('./lib/route')
    , socket = require('./lib/socket')
    , config = require('./lib/config');

// 配置
var app = express();
config(app);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("服务器已启动，监听端口号：" + app.get('port'));
});

// 路由
route(app);
// socket.io
socket(server);

