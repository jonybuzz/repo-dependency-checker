var express = require('express');
var router = express.Router();

router.get('/', loggedIn,
    function(req, res, next) {
    res.render('index', {username: req.session.user.name});
});

router.get('/repo', loggedIn,
 function(req, res, next) {
  res.render('repo-dependencies', {username: req.session.user.name});
});

function loggedIn(req, res, next) {
    if (req.session.token) {
        next();
    } else {
        console.dir(req.originalUrl);
        req.session.previousUrl = req.originalUrl;
        res.redirect('/auth');
    }
}

module.exports = router;
