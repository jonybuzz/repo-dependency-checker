function parseMarkdown(fileContent){
    var lines = fileContent.split("\n");
    lines.shift(); lines.shift() //para eliminar header de tabla
    var dependencies = lines.map(function(line){
        if(line){
            var partes = line.split('|')
            if(partes.length === 2 && partes[0] && partes[1])
            return {name: partes[0].trim(), version: partes[1].trim()}
        }
    }).filter(function( element ) {
        return element !== undefined;
    });
    return dependencies
}

module.exports.parseMarkdown = parseMarkdown
