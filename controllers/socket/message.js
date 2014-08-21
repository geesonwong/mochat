var roomMap = require('../context/roomContext').roomMap;
var util = require('../../lib/util');

/**
 * <p>绑定 message 事件</p>
 */
exports = module.exports = function (data) {
    if (!data.roomId || !roomMap.hasOwnProperty(data.roomId))
        return;
    console.log(this.id + "发送消息，内容是" + data.content);
    this.to(data.roomId).emit('msg', {
        roomId: data.roomId,
        content: data.content,
        time: util.getNowTime(),
        sender: {
            id: this.id,
            nickname: this.nickname || '陌生人'
        }
    });
};

