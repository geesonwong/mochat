var config = require('../config');

/**
 * 默认首页
 */
exports.defalutIndex = function (req, res, next) {
    return res.render('mac', {
        faviconUrl: config.front.faviconUrl
    });
};

exports.test1 = function (req, res, next) {
    return res.render('test1');
};

exports.test2 = function (req, res, next) {
    return res.render('test2');
};