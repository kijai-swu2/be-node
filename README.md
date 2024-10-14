# Node.js

## Modules

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
  - run : To excute a query
  - get : To fetch a row
  - all : To fetch all rows
- better-sql3
  - exec : To serialize
  - prepare
  - run : To excute an INSERT or an UPDATE query
  - all : To fetch all rows
  - get : To fetch a row

# NPM

Javascript 패키지 매니저

## Commands

Initiating a new NPM Project

- npm init -y : 프로젝트 생성
- npm i ${moduleName} : 모듈 가져오기

# Curl

명령줄(Command line)에서 HTTP 요청을 보내고 서버 응답을 확인하는 도구

## Commands

- GET

  ```shell
  curl ${Actual Service Address}
  ```

- POST

  ```shell
  # Basic
  curl -X POST -d ${What to post} ${Actual Service Address}

  # If json, add a content type
  curl -X POST -H "Content-Type: application/json" -d '${What to post}' ${Actual Service Address}
  ```

- PUT

  ```shell
  # Basic
  curl -X PUT -d ${What to change} ${Actual Service Address}

  # If json, add a content type
  curl -X PUT -H "Content-Type: application/json" -d '${What to change}' ${Actual Service Address}
  ```

- DELETE

  ```shell
  curl -X DELETE ${Actual Service Address}
  ```
