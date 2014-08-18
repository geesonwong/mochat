var Q = require('q');

/**
 * <p>绑定 join 事件</p>
 */
exports = module.exports = function (onEvent) {

    var joinPromise = onEvent('join');
    var joinedPromise = onEvent('joined');

    joinPromise.then(function (data) {
        console.log('join successed');
    }, function (data) {
        console.log('join faild');
    })
};