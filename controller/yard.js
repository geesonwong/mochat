var yardController = require('../lib/socket');

/**
 * 后台运维页面
 */
exports.index = function (req, res) {
    var sence = yardController.yard();
    var roomMap = sence.roomMap;
    var chattingCount = 0;
    for (var i in roomMap) {
        chattingCount += roomMap[i].length;
    }
    return res.render('yard', {
        onlineCount: sence.socketIO.nsps['/'].sockets.length,
        chattingCount: chattingCount,
        waiting: sence.waiting,
        roomMap: roomMap
    });
};