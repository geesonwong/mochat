var index = require('../controllers/index');
var yard = require('../controllers/yard');

/**
 * 路由
 */
exports = module.exports = function (app) {

    app.get('/', index.webapp);
    app.get('/mac', index.mac);

    app.get('/yard', yard.index);

};
