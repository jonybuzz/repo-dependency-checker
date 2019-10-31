var express = require('express')
var router = express.Router()
var passport = require('passport')
const { oauthLoginUrl } = require("@octokit/oauth-login-url")
const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
const config = require('../private/config');

router.get('/auth', function(req, res){
    loginUrl = oauthLoginUrl({
      clientId: config.github.clientID,
      redirectUri: config.github.callbackURL,
      scopes: ['repo', 'read:org', 'read:user'],
      allowSignup: true,
      state: 'maria',
      log: console
    })
    res.redirect(loginUrl.url)
});

router.get('/auth/callback', function(req, res) {
    console.dir(req.query)
    var code = req.query.code;
    var options = {
        clientId: config.github.clientID,
        clientSecret: config.github.clientSecret,
        code: code,
        state: 'maria'
    }
    const auth = createOAuthAppAuth(options);
    auth({type: "token"})
        .then(tokenAuth => {
            console.dir(tokenAuth)
            req.session.token = tokenAuth.token;
            res.redirect('/');
        }).catch(error => {
            console.dir(error);
            res.render('error', {message: 'Ups', error: error})
        });
  });

module.exports = router;
