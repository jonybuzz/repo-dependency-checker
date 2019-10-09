module.exports = {
    application: {
        name: 'repo-dependency-checker',
        version: 'v1.0.0'
    },
    credentials: {
        username: process.env.RDC_USERNAME,
        password: process.env.RDC_PASSWORD
    },
    github: {
        api: 'https://api.github.com'
    }
};
