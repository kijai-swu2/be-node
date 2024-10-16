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
  - define : To assign a model
  - sync : To sync the model to a database

# NPM & NPX

- NPM : Javascript 패키지 매니저
- NPX : Javascript 패키지 실행 도구

## Commands

```powershell
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

  ```powershell
  curl ${Actual Service Address}
  ```

- POST

  ```powershell
  # Basic
  curl -X POST -d ${What to post} ${Actual Service Address}

  # If json, add a content type
  curl -X POST -H "Content-Type: application/json" -d '${What to post}' ${Actual Service Address}
  ```

- PUT

  ```powershell
  # Basic
  curl -X PUT -d ${What to change} ${Actual Service Address}

  # If json, add a content type
  curl -X PUT -H "Content-Type: application/json" -d '${What to change}' ${Actual Service Address}
  ```

- DELETE

  ```powershell
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

   ```powershell
   npx sequelize init
   ```

2. Config 파일에서 DB 언어 및 DB 연결 설정하기

   아래 예제에서는 Sqlite을 이용하기 때문에 .db 파일을 기준으로 설정함

   ```json
   "dialect": "sqlite",
   "storage": "post.db"
   ```

3. 작업에 필요한 테이블들을 `/models` 폴더에 정의하기

4. 데이터베이스와 모델을 동기화하기

   동기화 실행 시 sync 메서드가 반환하는 Promise를 이용: 각각 성공 또는 실패 시 실행할 코드를 chaining해서 작성하기

   ```js
   models.sequelize
     .sync({ force: false }) // 이미 테이블이 있을 때 삭제하고 다시 생성하지 않도록 설정하기
     .then(() => {
       // 동기화가 성공적으로 완료될 경우에 처리할 코드: 콘솔에 출력하기
       console.log(`DB connected using ORM...`);
     })
     .catch((err) => {
       // 동기화가 실패할 경우에 처리할 코드: 오류를 출력하고 앱을 종료하기
       console.log(`DB Error: ${err}`);
       process.exit();
     });
   ```

5. 라우터에서 Callback 함수 실행 시 `async` / `await` 처리하기

   ```js
   // 게시글 목록보기
   app.get("/posts", async (req, res) => {
     const posts = await models.Post.findAll({
       include: [
         {
           model: models.Comment,
           require: true,
         },
       ],
     });
     res.json({ data: posts });
   });
   ```

## Sequelize CLI

### Migration

데이터베이스 모델에 생기는 수정사항들의 버전을 관리하기 위해 사용하는 도구로, CLI commands를 통해 `/migration` 폴더 안에 마이그레이션 파일을 생성한 후 적용한다.

\* CLI 도구를 이용해 모델을 생성하면 파일에 버전 관리를 위한 migration 파일이 자동 생성된다.

```powershell
# Task라는 테이블과 title, userId라는 컬럼을 가지는 모델 만들기
npx sequelize-cli model:generate --name Task --attributes title:string,userId:integer

# add-column-task라는 이름의 migration 파일 추가하기
npx sequelize-cli migration:generate --name add-column-task

# migration 폴더 내 수정사항 적용하기
npx sequelize-cli db:migrate
```

### Seeding

데이터베이스를 만든 후 초기 데이터나 더미 데이터를 삽입하는 것을 Seeding이라고 한다. CLI commands를 통해 `/seeders` 폴더 안에 시딩 파일을 생성한 후 적용한다.

```powershell
# demo-task라는 이름의 seeder 파일을 만들기
npx sequelize-cli seed:generate --name demo-task

# seeder 폴더 내 수정사항 적용하기
npx sequelize-cli db:seed:all
```
