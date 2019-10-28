const Octokit = require("@octokit/rest")
const config = require('../config');

function getFileContent(getContentsOptions){
    const octokit = Octokit({
            auth: "token " + TOKEN,
        //     {
        //     username: config.credentials.username,
        //     password: config.credentials.password
        // },
        userAgent: config.application.name + ' ' + config.application.version,
        baseUrl: config.github.api,
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

    return octokit.repos.getContents(getContentsOptions)
}

module.exports.getFileContent = getFileContent
