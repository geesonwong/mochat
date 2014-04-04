exports.index = function (req, res) {

    res.render('index', { title:'Express' });
};

exports.indexP = function (req, res) {
    res.render('_index', {title:'Express'});
};

exports.old = function(req,res){
    res.render('index_old_1', {title:'Express'});
};