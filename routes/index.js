var express = require('express');
var router = express.Router();

router.get('/dependencies', function(req, res, next) {
  res.render('index');
});

router.get('/dependencies/repo', function(req, res, next) {
  res.render('repo-dependencies');
});

module.exports = router;
