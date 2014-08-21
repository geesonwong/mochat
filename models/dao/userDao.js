var models = require('../index');
var User = models.User;

/**
 * 初始增加多一个用户
 */
exports.add = function (ip, callback) {
    var user = new User();
    user.ip = ip;
    user.save(callback);
};
