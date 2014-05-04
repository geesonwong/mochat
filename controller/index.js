var config = require('../config');

/**
 * 默认首页
 */
exports.mac = function (req, res) {
    return res.render('mac', {
        faviconUrl: config.front.faviconUrl
    });
};

exports.webapp = function (req, res) {
    return res.render('webapp');
};
