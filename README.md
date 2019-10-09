# Repo Dependency Checker

This app reads a Docker Compose YAML file, and searches organization repositories for dependencies.

Requirements:
- Image name must be equal to app´s repository name so RDC can find it
- Dependencies must be declared in "DEPENDENCIES.md" at the root of each repo with a Markdown table format
- Repo´s must be tagged with version number following semver

## Installation

To run locally, set this environmet variables:
  - RDC_USERNAME: Github username of an account with access to resources
  - RDC_PASSWORD: Github password of an account with access to resources

```
git clone https://github.com/jonybuzz/repo-dependency-checker.git
cd repo-dependency-checker
npm install
npm start
```

It will be running on port 3000

## Usage

### Get dependencies

It will list all projects with their declared dependencies

`GET http://localhost:3000/api/dependencies/{organization}/{repo}/{branch or tag}/{path to compose}`

```json
[
   {
      "name":"first-api",
      "version":"11.7.9",
      "dependencies":[
         {
            "name":"second-api",
            "version":"4.2.0"
         },
         {
            "name":"other-dep",
            "version":"1.1.1"
         }
      ]
   },
   {
      "name":"second-api",
      "version":"4.5.0",
      "dependencies":[]
   },
   {
      "name":"other-dep",
      "version":"1.0.0",
      "dependencies":[]
   }
]
```

### Validate dependencies

It lists all projects and show info about their dependency validation, using semver syntax. Possible status values are: `OK`, `NOT_SATISFIED` and `NOT_FOUND`

`GET http://localhost:3000/api/validate/{organization}/{repo}/{branch or tag}/{path to compose}`

```json
[
   {
      "name":"first-api",
      "version":"11.7.9",
      "dependencies":[
         {
            "name":"second-api",
            "validation":{
               "required":">=4.2.0",
               "actual":"4.5.0",
               "status":"OK"
            }
         },
         {
            "name":"other-dep",
            "validation":{
               "required":"1.1.x",
               "actual":"1.0.0",
               "status":"NOT_SATISFIED"
            }
         }
      ]
   },
   {
      "name":"second-api",
      "version":"4.5.0",
      "dependencies":[]
   },
   {
      "name":"other-dep",
      "version":"1.0.0",
      "dependencies":[]
   }
]
```
