/*
 * GET home page.
 */

exports.index = function (req, res) {

    res.render('index', { title:'Express' });
};

exports.indexP = function (req, res) {
    res.render('_index', {title:'Express'});
}