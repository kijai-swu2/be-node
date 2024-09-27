console.clear();

const fs = require("fs");
const express = require("express");
const moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

/* DB 세팅하기 */
const db_name = path.join(__dirname, "post.db"); // DB 이름 변수 선언하기
const db = new sqlite3.Database(db_name); // DB 이름 변수로 DB 연결 초기화하기

// 쿼리 선언하기
const create_sql = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
    content TEXT,
    author VARCHAR(100),
    createdAt VARCHAR(100),
    count INTEGER DEFAULT 0
  )`;
db.serialize(() => {
  // SQL 명령 실행하기
  db.run(create_sql);
});

/* 라우터 설정하기 */
app.set("view engine", "ejs");
app.set("views", "./views");

/* 게시글 목록 보기 */
app.get("/list", (req, res) => {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // 게시글 삭제 시, 실제로 삭제하지 않고 숨김 처리하도록 변경해서, 숨겨지지 않은 게시글만 보이도록 WHERE 조건을 추가함
  let sql = `SELECT id, title, content, author, createdAt, count FROM posts WHERE isDeleted = FALSE ORDER BY 1 DESC limit ? offset ?;`;
  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      db.get(`SELECT COUNT(1) AS count FROM posts`, (err, row) => {
        if (err) {
          res.status(500).send("Internal Server Error");
        } else {
          const total = row.count;
          const totalPage = Math.ceil(total / limit);
          res.render("list", {
            posts: rows,
            currentPage: page,
            totalPage: totalPage,
          });
        }
      });
    }
  });
});

/* 게시글 상세 보기 */
app.get("/view/:id", (req, res) => {
  const id = req.params.id;

  let sql = `SELECT id, title, content, author, createdAt FROM posts WHERE id = ${id};`;
  db.all(sql, [], (err, row) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      const post = row[0];
      res.render("view", { post: post });
    }
  });

  let countSql = `UPDATE posts SET count = count + 1 WHERE id = ${id};`;
  db.run(countSql);
});

/* 게시글 작성하기 */
// 1. 작성 화면 불러오기
app.get("/create", (req, res) => {
  res.render("create");
});

// 2. 작성한 내용 저장하기
// Form 데이터를 처리하기 위한 Express 미들웨어 설정하기
app.use(express.urlencoded({ extended: true }));

// 실제 저장 기능을 구현하기
app.post("/create", (req, res) => {
  const createdAt = moment().format("YY-MM-DD");

  let sql = `INSERT INTO posts(title, content, author, createdAt) VALUES( '${req.body.title}', '${req.body.content}', '${req.body.author}', '${createdAt}');`;
  db.run(sql, (err) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/list");
    }
  });
});

/* 게시글 수정하기 */
// 수정 화면 불러오기
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  let sql = `SELECT id, title, content, author, createdAt FROM posts WHERE id = ${id};`;
  db.all(sql, [], (err, row) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      const post = row[0];
      res.render("edit", { post: post });
    }
  });
});

// 수정한 내용 저장하기
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;

  let sql = `UPDATE posts SET title = '${req.body.title}', content = '${req.body.content}', author = '${req.body.author}' WHERE id = ${id};`;
  db.run(sql, (err) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect(`/view/${id}`);
    }
  });
});

/* 게시글 삭제하기 */
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;

  // 행을 실제로 삭제하기
  // let sql = `DELETE from posts WHERE id = ${id};`;

  // 실제로 삭제되지 않고 숨겨지도록 isDeleted 열을 TRUE 로 업데이트하기
  let sql = `UPDATE posts SET isDeleted = TRUE WHERE id = ${id};`;

  db.run(sql, (err) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/list");
    }
  });
});

const POST = 3000;
app.listen(POST, () => {
  console.log("Listening...");
});
