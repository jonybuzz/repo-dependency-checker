var express = require('express')
var router = express.Router()
const dependenciesService = require('../private/service/dependenciesService')

router.get('/dependencies/:owner/:repo/:ref/:path', function(req, res, next) {

    dependenciesService.findDependencies(req.params, req.query.strict, response => {
        res.status(200).send(response)
    }, error => {
        res.status(400).send({message: error})
    })
});

router.get('/validate/:owner/:repo/:ref/:path', function(req, res, next) {

    dependenciesService.validateDependencies(req.params, req.query.strict, response => {
        res.status(200).send(response)
    }, error => {
        res.status(400).send(error)
    })
});

module.exports = router;
