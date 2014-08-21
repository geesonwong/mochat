/**
 * <p>绑定 info 事件</p>
 */
exports = module.exports = function (data) {

    console.log(this.id + '客户端内容:' + data.clientId);

    var clientId = data.clientId;

};