
/*
 * GET home page.
 */

exports.index = function(req, res)
{
    res.render('index', { pagename: 'Summary of keys' });
};
