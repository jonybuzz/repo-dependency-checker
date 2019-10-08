const YAML = require('yaml')

function parseYaml(fileContent){
    var composeYaml = YAML.parse(fileContent)
    var apis = Object.entries(composeYaml.services).map(function(entry){
        var service = entry[1]
        var imageAndTag = service.image.split('/')[1]
        var image = imageAndTag.split(':')[0]
        var tag = 'v' + imageAndTag.split(':')[1]
        return {name: image, version: tag}
    })
    return apis
}

module.exports.parseYaml = parseYaml
