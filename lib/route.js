var index = require('../controller/index');
var yard = require('../controller/yard');

/**
 * 路由
 */
exports = module.exports = function (app) {

    app.get('/', index.webapp);
    app.get('/mac', index.mac);

    app.get('/yard', yard.index);

};
