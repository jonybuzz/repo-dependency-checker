module.exports = {
    application: {
        name: 'repo-dependency-checker',
        version: 'v1.2.0'
    },
    github: {
        api: 'https://api.github.com',
        clientID: process.env.RDC_CLIENT_ID,
        clientSecret: process.env.RDC_CLIENT_SECRET,
        callbackURL: process.env.RDC_AUTH_CALLBACK_URL
    }
};
