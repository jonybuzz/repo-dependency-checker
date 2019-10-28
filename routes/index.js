var express = require('express');
var router = express.Router();
var passport = require('passport')

router.get('/dependencies',
    function(req, res, next) {
    console.dir(req.user)
    res.render('index');
});

router.get('/dependencies/repo', function(req, res, next) {
  res.render('repo-dependencies');
});

module.exports = router;
