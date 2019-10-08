var express = require('express')
var router = express.Router()
const { createBasicAuth } = require("@octokit/auth-basic")
const Octokit = require("@octokit/rest")
var base64 = require('base-64')
const YAML = require('yaml')
const config = require('../private/config');

router.get('/:env', function(req, res, next) {

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

        apis.map(async function(api) {
            console.debug('Buscando dependencias de ' + api.name)
            octokit.repos.getContents({
                owner: 'lorfinsa',
                repo: api.name,
                path: 'DEPENDENCIES.md',
                ref: 'v' + api.version
            }).then(function(resp) {
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
                 console.dir(api)
                return api;
            }).catch(function(err) {
                if(err.status === 404){
                    console.error(api.name + ' no tiene declaradas las dependencias')
                } else {
                    console.error('Error ' + err.status + ' buscando dependencias de ' + api.name)
                }
            })
        })

        res.send(respuesta)
    }).catch(err => res.send(err))

});

module.exports = router;
