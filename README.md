# Repo Dependency Checker

This app reads a docker compose YAML file, and searches organization repositories for dependencies

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
      "version":"v11.7.9",
      "dependencies":[
         { 
            "name":"second-api",
            "version":"v4.2.0"
         },
         { 
            "name":"other-dep",
            "version":"v1.1.1"
         }
      ]
   },
   { 
      "name":"second-api",
      "version":"v4.5.0",
      "dependencies":[]
   },
   { 
      "name":"other-dep",
      "version":"v1.0.0",
      "dependencies":[]
   }
]
```

### Validate dependencies

It lists all projects and show info about their dependency validation.

`GET http://localhost:3000/api/validate/{organization}/{repo}/{branch or tag}/{path to compose}`

```json
[ 
   { 
      "name":"first-api",
      "version":"v11.7.9",
      "dependencies":[
         { 
            "name":"second-api",
            "validation":{ 
               "required":"v4.2.0",
               "actual":"v4.5.0",
               "status":"OK"
            }
         },
         { 
            "name":"other-dep",
            "validation":{ 
               "required":"v1.1.1",
               "actual":"v1.0.0",
               "status":"NOT_SATISFIED"
            }
         }
      ]
   },
   { 
      "name":"second-api",
      "version":"v4.5.0",
      "dependencies":[]
   },
   { 
      "name":"other-dep",
      "version":"v1.0.0",
      "dependencies":[]
   }
]
```
