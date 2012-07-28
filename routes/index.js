
/*
 * GET home page.
 */

exports.index = function(req, res){
    req.session.user={
                        info:
                            {
                                name:'chenzeyu'
                            }
                        };
  res.render('index', { title: 'Express' });
};