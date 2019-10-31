var express = require('express')
var router = express.Router()
const dependenciesService = require('../private/service/dependenciesService')

router.get('/dependencies/:owner/:repo/:ref/:path', loggedIn, function(req, res, next) {

    dependenciesService.findDependencies(req.params, req.query.strict, req.session.token, response => {
        res.status(200).send(response)
    }, error => {
        console.dir(error)
        res.status(400).send({message: error})
    })
});

router.get('/validate/:owner/:repo/:ref/:path', loggedIn, function(req, res, next) {

    dependenciesService.validateDependencies(req.params, req.query.strict, req.session.token, response => {
        res.status(200).send(response)
    }, error => {
        res.status(400).send({message: error})
    })
});

router.get('/validate/:owner/:repo/:ref/:path/:app/:release', function(req, res, next) {

    dependenciesService.validateAppDependencies(req.params, req.query.strict, req.session.token, response => {
        res.status(200).send(response)
    }, error => {
        res.status(400).send({message: error})
    })
});

function loggedIn(req, res, next) {
    if (req.session.token) {
        next();
    } else {
        res.redirect('/auth/github');
    }
}

module.exports = router;
