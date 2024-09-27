# 240924

## Node.js

### Modules

```js
const moduleName = require("${moduleName}");
```

- exports
- http
  - createServer
  - listen
- fs
  - readFile ( with a call back function )
  - readFileSync ( without a call back function )
  - writeFile
  - writeFileSync
- child_process
  - exec
- path
  - join
  - parse
- os
  - platform
  - arch
  - cpus
  - totalmem
  - freemem
- url
  - parse().pathname
  - parse().query
- express
  - get
  - listen
  - send
  - json
  - post
- nodemon
  - npm run ${keyword} : Run a file with nodemon, using a keyword.
- pug
- handlebars : {{ }}
- ejs : <% %>
- moment
  - format("${format}")
- sqlite3
  - serialize
  - all : To fetch all rows
  - run : To excute a query

## NPM commands

### Initiating a new NPM Project

- npm init -y
- npm i ${moduleName}
