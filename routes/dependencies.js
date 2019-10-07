var express = require('express');
var router = express.Router();
const { createBasicAuth } = require("@octokit/auth-basic");
const Octokit = require("@octokit/rest");
var base64 = require('base-64');
const YAML = require('yaml')

/* GET users listing. */
router.get('/:env', function(req, res, next) {

  var env = req.params.env;

  const octokit = Octokit({
    auth: {
      username:'xxx',
      password:'xxx'
    },
    userAgent: 'repo-dependency-checker v1.0.0',
    previews: ['jean-grey', 'symmetra'],
    baseUrl: 'https://api.github.com',
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    request: {
      agent: undefined,
      fetch: undefined,
      timeout: 0
    }
  })

  octokit.repos.getContents({
    owner: 'lorfinsa',
    repo: 'ccc-compose',
    path: 'ccc-apis-nr.yml',
    ref: env
  }).then(function(resp){
    var fileContent = base64.decode(resp.data.content)
    var yaml = YAML.parse(fileContent)
    var apis = Object.entries(yaml.services).map(function(entry){
        var service = entry[1]
        var imageAndTag = service.image.split('/')[1]
        var image = imageAndTag.split(':')[0]
        var tag = imageAndTag.split(':')[1]
        return {
          repo: image,
          version: tag
        }
    })
    res.send(apis)
  }).catch(err => res.send(err))

});

module.exports = router;
