var index = require('../controller/index');
var yard = require('../controller/yard');

/**
 * 路由
 */
exports = module.exports = function (app) {

    app.get('/', index.webapp);
    app.get('/w', index.webapp);

    app.get('/t', index.test);

};
