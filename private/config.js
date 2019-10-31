module.exports = {
    application: {
        name: 'repo-dependency-checker',
        version: 'v1.1.0'
    },
    github: {
        api: 'https://api.github.com',
        clientID: process.env.RDC_CLIENT_ID,
        clientSecret: process.env.RDC_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/callback'
    }
};
