const githubFileService = require('./githubFileService')
const composeParser = require('../utils/composeParser')
const dependenciesParser = require('../utils/dependenciesParser')
var base64 = require('base-64')
const semver = require('semver')

function findDependencies(params, strictCheck, resolve, reject){

    githubFileService.getFileContent({
        owner: params.owner,
        repo: params.repo,
        path: params.path + '.yml',
        ref: params.ref
    }).then(function(resp){
        var composeContent = base64.decode(resp.data.content)
        var apis = composeParser.parseYaml(composeContent)

        Promise.all(apis.map(function(api) {
                console.debug('Buscando dependencias de ' + api.name)

                return new Promise((res, rej) => {
                    githubFileService.getFileContent({
                        owner: params.owner,
                        repo: api.name,
                        path: 'DEPENDENCIES.md',
                        ref: api.version
                    }).then(resp => {
                        var dependenciesMdContent = base64.decode(resp.data.content)
                        api.dependencies = dependenciesParser.parseMarkdown(dependenciesMdContent)
                        res(api);
                    }).catch(err => {
                        if(err.status === 404){
                            var msj = api.name + ' ' + api.version + ' DEPENDENCIES.md Not Found'
                            console.error(msj)
                            if(strictCheck){
                                rej(msj)
                            } else {
                                res(api)
                            }
                        } else {
                            console.error('Error ' + err.status + ' buscando dependencias de ' + api.name)
                        }
                    })
                });
            })
        ).then(resolve).catch(reject); //Promise.all error

    }).catch(reject) //get compose content error
}

function validateDependencies(params, strictCheck, resolve, reject){

    findDependencies(params, strictCheck, apis => {
        var validatedApis = apis.map(api => {
            console.debug('\nValidating ' + api.name)
            if(api.dependencies){
                api.dependencies = api.dependencies.map(dependency => {
                    console.debug('Validating dependency ' + dependency.name)
                    var dependencyInRoot = apis.find(function(item){
                        return item.name == dependency.name
                    })
                    if(dependencyInRoot) {
                        var satisfies = semver.satisfies(dependencyInRoot.version, '>=' + dependency.version)
                        console.debug(satisfies + ' => ' + dependencyInRoot.version + '/' + dependency.version)
                        dependency.validation = {
                            required: dependency.version,
                            actual: dependencyInRoot.version
                        }
                        if(satisfies) {
                            dependency.validation.status = 'OK'
                        } else {
                            dependency.validation.status = 'NOT_SATISFIED'
                        }
                    } else {
                        console.debug('not found')
                        dependency.validation = {
                            required: dependency.version,
                            actual: null,
                            status: 'NOT_FOUND'
                        }
                    }
                    return dependency
                })
            }
            return api
        });
        resolve(validatedApis)
    }, reject)
}

module.exports.findDependencies = findDependencies
module.exports.validateDependencies = validateDependencies
