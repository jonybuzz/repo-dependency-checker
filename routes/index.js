var express = require('express');
var router = express.Router();

router.get('/', loggedIn,
    function(req, res, next) {
    res.render('index', {user: null});
});

router.get('/repo', loggedIn,
 function(req, res, next) {
  res.render('repo-dependencies', {user: null});
});

function loggedIn(req, res, next) {
    //if (req.user) {
        next();
    //} else {
    //    res.redirect('/auth/github');
    //}
}

module.exports = router;
