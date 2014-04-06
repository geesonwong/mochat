var index = require('../controller/index');
var yard = require('../controller/yard');

/**
 * 路由
 */
exports = module.exports = function (app) {

    app.get('/', index.defalutIndex);
    app.get('/t1', index.test1);
    app.get('/t2', index.test2);

    app.get('/yard', yard.index);

};
