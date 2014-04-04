var index = require('../controller/index');

/**
 * 路由
 */
exports = module.exports = function (app) {
    app.get('/', index.defalutIndex);
};
