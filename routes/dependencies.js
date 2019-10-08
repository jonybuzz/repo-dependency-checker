var express = require('express')
var router = express.Router()
const { createBasicAuth } = require("@octokit/auth-basic")
const Octokit = require("@octokit/rest")
var base64 = require('base-64')
const YAML = require('yaml')
const config = require('../private/config');

router.get('/:env', function(req, res, next) {

    let strictCheck = req.query.strict;
    var env = req.params.env

    const octokit = Octokit({
            auth: {
            username: config.credentials.username,
            password: config.credentials.password
        },
        userAgent: 'repo-dependency-checker v1.0.0',
        baseUrl: 'https://api.github.com',
        log: {
            debug: () => {},
            info: console.info,
            warn: console.warn,
            error: console.error
        },
        request: {
            timeout: 5000
        }
    })

    octokit.repos.getContents({
        owner: 'lorfinsa',
        repo: 'ccc-compose',
        path: 'ccc-apis-nr.yml',
        ref: env
    }).then(function(resp){
        var composeContent = base64.decode(resp.data.content)
        var composeYaml = YAML.parse(composeContent)
        var apis = Object.entries(composeYaml.services).map(function(entry){
            var service = entry[1]
            var imageAndTag = service.image.split('/')[1]
            var image = imageAndTag.split(':')[0]
            var tag = imageAndTag.split(':')[1]
            return {
                name: image,
                version: tag
            }
        })

        var results = Promise.all(apis.map(function(api) {

                console.debug('Buscando dependencias de ' + api.name)

                return new Promise((resolve, reject) => {
                    octokit.repos.getContents({
                        owner: 'lorfinsa',
                        repo: api.name,
                        path: 'DEPENDENCIES.md',
                        ref: 'v' + api.version
                    }).then(resp => {
                        var dependenciesMdContent = base64.decode(resp.data.content)
                        lines = dependenciesMdContent.split("\n");
                        lines.shift()
                        lines.shift() //para eliminar header de tabla
                        var dependencies = lines.map(function(line){
                            if(line){
                                var partes = line.split('|')
                                if(partes.length === 2 && partes[0] && partes[1])
                                return {
                                    name: partes[0].trim(),
                                    version: partes[1].trim()
                                }
                            }
                        }).filter(function( element ) {
                            return element !== undefined;
                        });
                        api.dependencies = dependencies
                        resolve(api);
                    }).catch(err => {
                        if(err.status === 404){
                            var msj = api.name + ' ' + api.version + ' no tiene declaradas las dependencias'
                            console.error(msj)
                            if(strictCheck){
                                reject(msj)
                            } else {
                                resolve(api)
                            }
                        } else {
                            console.error('Error ' + err.status + ' buscando dependencias de ' + api.name)
                        }
                    })
                });
            })
        ).then(function(prom, e){
            res.send(prom)
        }).catch(err => res.status(400).send(err)); //Promise.all error

    }).catch(err => res.send(err)) //get compose content error

});

module.exports = router;
