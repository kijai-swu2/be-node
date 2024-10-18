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
  - get / post / put / delete : To create a router with a given method
  - listen
  - send
  - json
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
- multer
- bcryptjs : To crypt passwords and compare
  - compare : To compare given data
  - hash : To hash given data
- jsonwebtoken : To manage JSON web tokens for authentification
  - sign : To create a token
  - verify : To compare tokens
- mongoose
  - connect : To connect to the DB
  - connection : To select the current DB
  - Schema : To define a schema
  - model : To initiate models

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

Sequelize를 쉽게 이용하게 도와주는 모듈

### Migration

데이터베이스 모델에 생기는 수정사항들의 버전을 관리하기 위해 사용하는 도구이다. `/migration` 폴더 안에 마이그레이션 파일을 생성, 내용을 작성한 후 적용하는 방식으로 사용한다.

\* CLI commands를 이용해 생성된 모델의 경우 migration 파일이 자동 생성된다.

```powershell
# Task라는 테이블과 title, userId라는 컬럼을 가지는 모델 만들기
npx sequelize-cli model:generate --name Task --attributes title:string,userId:integer

# add-column-task라는 이름의 migration 파일 추가하기
npx sequelize-cli migration:generate --name add-column-task

# migration 폴더 내 수정사항 적용하기
npx sequelize-cli db:migrate

# 가장 최근에 적용된 수정사항 모두 폐기하기
npx sequelize-cli db:migrate:undo:all
```

### Seeding

데이터베이스를 만든 후 초기 데이터나 더미 데이터를 삽입하는 것을 Seeding이라고 한다. `/seeders` 폴더 안에 시딩 파일을 생성, 내용을 작성한 후 실행하는 방식으로 사용한다.

```powershell
# demo-task라는 이름의 seeder 파일을 만들기
npx sequelize-cli seed:generate --name demo-task

# seeder 폴더 내 파일들 모두 실행하기
npx sequelize-cli db:seed:all

# 모든 seeding 폐기하기
npx sequelize-cli db:seed:undo:all
```

# Multer

파일을 업로드할 수 있게 도와주는 모듈

## Procedure

### 전제사항 : 미들웨어 설정하기

- express.urlencoded 미들웨어 설정하기

  `"Content-Type: application/x-www-form-urlencoded"`를 사용할 수 있게 해주는 미들웨어

  ```js
  app.use(express.urlencoded({ extended: true }));
  ```

- express.static 미들웨어 설정하기

  가상의 라우터를 생성해 특정 디렉토리와 연결할 수 있게 도와주는 미들웨어로, 브라우저에서 `/${라우터}/${파일 이름}`으로 접근 시
  `/${디렉토리}/${파일 이름}` 파일에 접근할 수 있게 한다.

  ```js
  // 가상의 라우터 "/downloads"를 생성하고, 해당 라우터를 파일들이 저장된 폴더 "~/public/uploads"와 연결
  app.use("/downloads", express.static(path.join(__dirname, "public/uploads")));
  ```

### Storage 설정하기

유저가 업로드한 파일이 저장될 디렉토리를 설정한다. `express.static` 미들웨어에서 사용했던 디렉토리와 동일하게 설정한다.

```js
// 디렉토리를 변수화하기
const upload_dir = "public/uploads";

// 디렉토리 변수를 이용해 Storage 설정하기
const storage = multer.diskStorage({
  destination: `./${upload_dir}`,
  filename: function (req, file, cb) {
    // 파일 업로드 시 이름 규칙을 추가하는 callback 함수 설정하기
    cb(null, path.parse(file.originalname).name + "-" + Date.now() + path.extname(file.originalname)); // 중복되는 이름의 파일을 업로드 시 파일이 덮어씌워지지 않도록 타임스탬프를 넣기
  },
});
```

### Multer 인스턴싱하기

```js
// upload라는 이름의 변수를 선언해 Multer 작업들을 시작하기
const upload = multer({ storage: storage });
```

### 업로드 기능 사용하기

라우터에 파일 업로드 기능을 추가한다. 라우터 실행 매개변수로 Multer single 함수를 전달하고, callback 함수에 적용한다.

```js
// 첨부파일을 포함하는 게시글을 추가하기
app.post("/posts", upload.single("file"), async (req, res) => {
  const { title, content, author } = req.body;

  // 삼항 연산자를 이용해 request에 첨부된 파일이 있을 시에 파일 이름을 반환하는 변수 설정하기
  let filename = req.file ? req.file.filename : null;

  // 파일 이름에 express.static 미들웨어로 설정한 라우터 URI 추가하기
  filename = `/downloads/${filename}`;

  // request에서 전달받은 내용으로 Post 모델에 데이터 삽입하기
  const post = await models.Post.create({
    title: title,
    content: content,
    author: author,
    filename: filename,
  });

  /* 이하 생략 */
});
```

# MVC Pattern

## Key concepts

- DAO : DB에 대한 CRUD 처리하는 역할
- Service : DAO를 호출해서 데이터를 가져오거나 비즈니스 로직에 따라 가공하는 역할
- Controller : 라우터에 따라 실행될 callback 함수들을 정의하는 역할

## Data flow

    Module > DAO > Service > Controller > Router

## Code breakdown

기존 코드를 MVC 패턴으로 쪼개보면 다음과 같다.

```js
// 기존 코드 : 게시글을 생성하기
// # 1
app.post("/posts", async (req, res) => {
  // # 2
  const { title, content, author } = req.body;

  // # 3, 4
  const post = await models.Post.create({
    title: title,
    content: content,
    author: author,
  });
  res.status(201).json(post);
});
```

### 1. Router 및 URI 설정

#### 1-1. Router 설정

`app.js` 파일에 라우터를 설정한다.

```js
const express = require("express");
const postRoute = require("./routes/postRoute");
const app = express();
app.use("/posts", postRoute);
```

#### 1-2. URI 설정

라우터 파일에 URI를 설정한다.

```js
const express = require("express");
const router = express.Router();
router.post("/", postController.createPost);
```

### 2. Controller & Service 간 통신

클라이언트에서 받아온 정보들을 가지고 Service과 통신하고, 통신 결과에 따라 미리 정의된 함수들을 클라이언트에 실행한다.

```js
const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 3. Service & DAO 간 통신

비즈니스 로직에 맞춰 DAO에서 반환된 데이터를 가공한다.

```js
const createPost = async (data) => {
  return await postDao.createPost(data);
};
```

### 4. DAO & Model 간 통신

질의문을 통해 Model에 처리할 작업이나 트랜잭션을 정의한다.

```js
const createPost = async (data) => {
  return await models.Post.create(data);
};
```

# Jest

# JWT 인증

JSON 형식의 웹 토큰을 이용하는 인증 방식이다. 로그인 시 Token 2종(Access, Refresh)을 발급하고, Storage에 저장해 검증에 이용한다.

## Key concepts

- Access token : 보안을 위해 단기간 동안만 유지되는 목적의 토큰
- Refresh token : 로그인 인증을 유지하기 위해 생성하는 토큰으로, Access token이 만료됐을 경우 2차 검증의 수단으로 사용

## Procedure

    Access token으로 검증 시도
    	→ (성공 시) 검증 완료, 프로세스 종료
    	→ (실패 시) Refresh token으로 재검증
    		→ (성공 시) Access 실행 후 재검증
    		→ (실패 시) 검증 실패, 프로세스 종료
