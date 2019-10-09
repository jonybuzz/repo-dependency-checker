const githubFileService = require('./githubFileService')
const composeParser = require('../utils/composeParser')
const dependenciesParser = require('../utils/dependenciesParser')
const base64 = require('base-64')
const semver = require('semver')

function findDependencies(params, strictCheck, resolve, reject){

    githubFileService.getFileContent({
        owner: params.owner,
        repo: params.repo,
        path: params.path + '.yml',
        ref: params.ref
    }).then(function(response){
        var composeContent = base64.decode(response.data.content)
        var apis = composeParser.parseYaml(composeContent)

        Promise.all(apis.map(api => populateDependenciesAsync(api, params.owner, strictCheck)))
            .then(resolve)
            .catch(reject)

    }).catch(reject)
}


function validateDependencies(params, strictCheck, resolve, reject){

    findDependencies(params, strictCheck, apis => {
        var validatedApis = apis.map(api => {
            console.debug('\nValidating ' + api.name + '...')
            if(api.dependencies){
                api.dependencies = api.dependencies.map(dependency =>
                    dependency.validation = getValidation(dependency, apis))
            }
            return api
        });
        resolve(validatedApis)
    }, reject)
}


function populateDependenciesAsync(api, owner, strictCheck) {

    return new Promise((res, rej) => {
        console.debug('Looking for ' + api.name + ' dependencies...')
        githubFileService.getFileContent({
            owner: owner,
            repo: api.name, //repo name must be equal to api name
            path: 'DEPENDENCIES.md',
            ref: 'v' + api.version
        }).then(response => {
            var dependenciesMdContent = base64.decode(response.data.content)
            api.dependencies = dependenciesParser.parseMarkdown(dependenciesMdContent)
            res(api)
            return
        }).catch(err => {
            if(err.status === 404) {
                var msj = api.name + ' ' + api.version + ' DEPENDENCIES.md Not Found'
                console.error(msj)
                if(strictCheck){
                    rej(msj)
                    return
                } else {
                    res(api)
                    return
                }
            } else {
                console.error('Error ' + err.status + ' looking for ' + api.name + ' dependencies')
            }
        })
    });
}

function getValidation(dependency, apis){
    console.debug('Dependency ' + dependency.name + '...')
    var dependencyInRoot = apis.find(function(item){
        return item.name == dependency.name
    })
    var validation = {}
    if(dependencyInRoot) {
        var satisfies = semver.satisfies(dependencyInRoot.version, '>=' + dependency.version)
        console.debug(satisfies + ' => ' + dependencyInRoot.version + '/' + dependency.version)
        validation = {
            required: dependency.version,
            actual: dependencyInRoot.version
        }
        if(satisfies) {
            validation.status = 'OK'
        } else {
            validation.status = 'NOT_SATISFIED'
        }
    } else {
        console.debug('not found')
        validation = {
            required: dependency.version,
            actual: null,
            status: 'NOT_FOUND'
        }
    }
    return validation
}

module.exports.findDependencies = findDependencies
module.exports.validateDependencies = validateDependencies
