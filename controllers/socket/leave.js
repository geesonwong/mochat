var Q = require('q');
/**
 * <p>绑定 leave 事件</p>
 */
exports = module.exports = function (onEvent) {

    var leavePromise = onEvent('leave');
    var leftPromise = onEvent('left');

    leavePromise.then(function (data) {
        console.log('leave successed');
    }, function (data) {
        console.log('leave faild');
    })

};