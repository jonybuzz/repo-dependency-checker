const Octokit = require("@octokit/rest")
const config = require('../config');

function getFileContent(getContentsOptions){
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

    return octokit.repos.getContents(getContentsOptions)
}

module.exports.getFileContent = getFileContent
