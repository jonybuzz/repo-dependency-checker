var express = require('express');
var router = express.Router();
const Octokit = require("@octokit/rest");
var base64 = require('base-64');

/* GET users listing. */
router.get('/', function(req, res, next) {

  const octokit = Octokit({
    auth: "eb46253c59d32651a49bc7000ff32eda5f57c6a6",
    userAgent: 'myApp v1.2.3',
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

  var compose = octokit.repos.getContents({
    owner:'lorfinsa',
    repo:'ccc-compose',
    path:'ccc-apis-nr.yml',
    ref:'staging'
  }).then(function(resp){
    res.send(base64.decode(resp.data.content))
  })
});

module.exports = router;
