var config = require('../config');

/**
 * 默认首页
 */
exports.defalutIndex = function (req, res, next) {
    return res.render('mac', {
        faviconUrl: config.front.faviconUrl
    });
};

exports.webapp = function (req, res, next) {
    return res.render('webapp');
};

exports.test = function (req, res, next) {
    return res.render('test1');
};

exports.test = function (req, res, next) {
    return res.render('test1');
};