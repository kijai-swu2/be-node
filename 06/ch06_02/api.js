const express = require("express");
const moment = require("moment");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json()); // JSON 미들웨어 설정

/* DB 생성 및 초기화하기 */
const db_name = path.join(__dirname, "post.db");
const db = new sqlite3.Database(db_name);

const create_sql = `
  CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255),
    content TEXT,
    author VARCHAR(100),
    createdAt DATETIME DEFAULT current_timestamp,
    count INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE
);`;

db.serialize(() => {
  db.run(create_sql);
});

/* 1. GET /posts 게시글 목록 가져오기 */
app.get("/posts", (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const select_sql = `
    SELECT *
    FROM posts
    WHERE isDeleted = FALSE
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?;
  `;

  db.all(select_sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      const count_sql = `SELECT COUNT(1) FROM posts AS count WHERE isDeleted = FALSE;`;
      db.get(count_sql, (err1, row) => {
        if (err1) {
          console.error(err1.message);
          res.status(500).send(err1.message);
        } else {
          const total = row.count;
          const totalPages = Math.ceil(total / limit);
          res.json({ items: rows, currentPage: page, totalPages: totalPages });
        }
      });
    }
  });
});

/* 2. GET /posts/id 게시글 상세보기 */
app.get("/posts/:id", (req, res) => {
  const id = req.params.id;

  let select_sql = `SELECT * FROM posts WHERE id = ? AND isDeleted = FALSE;`;
  let count_sql = `UPDATE posts SET count = count + 1 WHERE id = ? AND isDeleted = FALSE;`;

  db.run(count_sql, [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      db.get(select_sql, [id], (err1, row) => {
        if (err1) {
          console.error(err1.message);
          res.status(500).send(err1.message);
        } else {
          res.json({ item: row });
        }
      });
    }
  });
});

/* 3. POST /posts 게시글 생성하기 */
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  const insert_sql = `
    INSERT INTO posts(title, content, author) VALUES (?, ?, ?);
  `;

  db.run(insert_sql, [title, content, author], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
    console.log(`row id: ${this.lastID}`);
    res.json({ result: "success", id: this.lastID });
  });
});

/* 4. PUT /posts/id 게시글 수정하기 */
app.put("/posts/:id", (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const update_sql = `UPDATE posts SET title = ?, content = ? WHERE id = ?;`;

  db.run(update_sql, [title, content, id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err.mssage);
    } else {
      res.json({ result: "Success" });
    }
  });
});

/* 5. DELETE /posts/id 게시글 삭제하기 */
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;
  const delete_sql = `UPDATE posts SET isDeleted = TRUE WHERE id = ?;`;
  db.run(delete_sql, [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    } else {
      res.json({ result: "Success" });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}..`);
});
