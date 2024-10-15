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
- express-graphql : GraphQL API를 클라이언트에 전송하는 라이브러리
- sequelize
  - define
  - sync

# NPM & NPX

- NPM : Javascript 패키지 매니저
- NPX : Javascript 패키지 실행 도구

## Commands

```shell
# Initiating a new NPM Project
npm init -y # 프로젝트 생성
npm i ${moduleName} # 모듈 가져오기

# Excuting a package
npx ${moduleName} init
```

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

# GraphQL

페이스북에서 만든, API를 위한 쿼리 언어이다.

RESTful API와는 다르게 단일 라우터를 사용해 적은 네트워크 통신으로 다양한 요청을 전달할 수 있다.

## Keywords

- Schema & Resolver
- Fetching: Over-fetching & Under-fetching
- Batching

## Procedure

1. Schema 설정하기

   CRUD 작업에 필요한 Query, Mutation 타입들을 설정하기 → 각 작업에서 송수신할 자료들의 타입을 설정하기 → 서버에 전송할 자료들의 타입을 설정하기

2. 요청을 처리하는 Resolver 설정하기

3. 앱에서 GraphQL 미들웨어 설정하기

# Sequelize

관계형 DB를 Object Relation Mapping 하는 도구

## Procedure

1. Sequelize 초기화하기

   ```shell
   npx sequelize init
   ```

2. Config 파일에서 dialect, storage 설정하기

3. 필요한 모델들을 추가해주기

4. 데이터베이스와 모델을 동기화하기 : async / await
