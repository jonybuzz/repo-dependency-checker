const githubFileService = require('./githubFileService')
var base64 = require('base-64')
const YAML = require('yaml')

function findDependencies(params, strictCheck, resolve, reject){

    githubFileService.getFileContent({
        owner: params.owner,
        repo: params.repo,
        path: params.path + '.yml',
        ref: params.ref
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

                return new Promise((res, rej) => {
                    githubFileService.getFileContent({
                        owner: params.owner,
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
                        res(api);
                    }).catch(err => {
                        if(err.status === 404){
                            var msj = api.name + ' ' + api.version + ' no tiene declaradas las dependencias'
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

module.exports.findDependencies = findDependencies
