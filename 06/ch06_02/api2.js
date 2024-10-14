// 콜백 함수를 사용하지 않는 Better Sqlite3 사용해보기
const express = require("express");
const moment = require("moment");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

/* DB 생성 및 초기화하기 */
const db_name = path.join(__dirname, "post.db");
const db = new Database(db_name);

const create_sql = `
  CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255),
  content TEXT,
  author VARCHAR(100),
  createAt DATETIME DEFAULT current_timestamp,
  count INT DEFAULT 0,
  isDeleted BOOLEAN DEFAULT FALSE
  );
  
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    postID INTEGER,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(postID) REFERENCES posts(id)
  );
  `;

db.exec(create_sql); // Better Sqlite3의 초기화 구문

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

  const stmt = db.prepare(select_sql);
  const rows = stmt.all(limit, offset);
  res.json({ items: rows });
});

/* 2. GET /posts/id 게시글 상세보기 */
app.get("/posts/:id", (req, res) => {
  const id = req.params.id;

  let select_sql = `SELECT * FROM posts WHERE id = ? AND isDeleted = FALSE;`;
  let count_sql = `UPDATE posts SET count = count + 1 WHERE id = ? AND isDeleted = FALSE;`;

  // 아래의 2줄을 변수 선언 없이 Chaining으로 간결하게 작성하기
  // const stmt = db.prepare(count_sql);
  // stmt.run(id);
  db.prepare(count_sql).run(id);
  const post = db.prepare(select_sql).get(id);
  res.status(200).json({ item: post });
});

/* 3. POST /posts 게시글 생성하기 */
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  const insert_sql = `
    INSERT INTO posts(title, content, author) VALUES (?, ?, ?);
  `;

  const stmt = db.prepare(insert_sql);
  const result = stmt.run(title, content, author);
  console.log(JSON.stringify(result));
  res.status(201).json({ id: result.lastInsertRowid, title: title, content: content, author: author });
});

/* 4. PUT /posts/id 게시글 수정하기 */
app.put("/posts/:id", (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const update_sql = `UPDATE posts SET title = ?, content = ? WHERE id = ? AND isDeleted = FALSE;`;

  // Try & Catch 구문으로 예외처리 더하기
  try {
    const result = db.prepare(update_sql).run(title, content, id);
    if (result.changes) {
      console.log(result);
      res.status(200).json({ result: "Succedeed", id: id }); // 데이터 업데이트에 성공했을 경우
    } else {
      res.status(404).json({ error: "Something went wrong" }); // 데이터 업데이트에 실패했을 경우
    }
  } catch (error) {
    res.status(500).json({ error: error }); // 서버에 에러가 있을 경우
  }
});

/* 5. DELETE /posts/id 게시글 삭제하기 */
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;
  const delete_sql = `UPDATE posts SET isDeleted = TRUE WHERE id = ?;`;
  try {
    const result = db.prepare(delete_sql).run(id);
    if (result.changes) {
      res.status(204).end(); // 데이터 삭제는 했으나 값을 반환할 필요가 없어서 204 코드를 사용해 종료
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/* 6-1. POST /posts/postId/comment 댓글 생성하기 */
app.post("/posts/:postId/comment", (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;
  const insert_sql = `INSERT INTO comments(content, postID) VALUES(?, ?);`;

  try {
    const result = db.prepare(insert_sql).run(content, postId);
    if (result.changes) {
      res.status(201).json({ id: result.lastInsertRowid, postId: postId, content: content });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/* 6-2. GET /posts/postId/comment/id 댓글 목록 가져오기 */
app.get("/posts/:postId/comment/", (req, res) => {
  const postId = req.params.postId;
  const select_sql = `SELECT * FROM comments WHERE postId = ? AND isDeleted = FALSE ORDER BY id DESC`;

  try {
    const result = db.prepare(select_sql).all(postId);
    if (result) {
      res.status(200).json({ result: result });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

/* 6-3. PUT /comment/id 댓글 수정하기 */
app.put("/comment/:id", (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  const stmt = db.prepare(`UPDATE comments SET content = ? WHERE id = ? AND isDeleted = FALSE`);
  const result = stmt.run(content, id);
  if (result.changes) {
    res.status(200).json({ status: "Succedeed", result: result });
  } else {
    res.status(400).json({ error: "Comment not found" });
  }
});

/* 6-4. DELETE /comment/id 댓글 삭제하기 */
app.delete("/comment/:id", (req, res) => {
  const id = req.params.id;
  const result = db.prepare(`UPDATE comments SET isDeleted = TRUE WHERE id = ? AND isDeleted = FALSE`).run(id);
  if (result.changes) {
    res.status(200).json({ status: "Succedeed", result: result });
  } else {
    res.status(400).json({ status: "Failed", result: result });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}..`);
});
