console.clear();

const fs = require("fs");
const express = require("express");
const moment = require("moment");
const app = express();

/* 라우터 설정하기 */
app.set("view engine", "ejs");
app.set("views", "./views");

/* 게시글 Id 관리하기 */
let maxId = 0;

const initId = () => {
  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);
  const idList = dataPrs["result"].map((item) => parseInt(item.id));
  maxId = Math.max(...idList);
};

const getId = () => {
  return ++maxId;
};

initId();

/* 게시글 목록 보기 */
app.get("/list", (req, res) => {
  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);

  res.render("list", { posts: dataPrs["result"] });
});

/* 게시글 상세 보기 */
app.get("/view/:id", (req, res) => {
  const id = req.params.id;

  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);
  let post = {};

  dataPrs["result"].forEach((item) => {
    if (item["id"] == id) {
      post = item;
      item.count = item.count + 1;
    }
  });

  fs.writeFileSync("test.json", JSON.stringify(dataPrs), "utf-8");
  res.render("view", { post: post });
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
  const data = fs.readFileSync("test.json", "utf-8");
  let dataPrs = JSON.parse(data);

  const lastId = getId();
  const createdAt = moment().format("YY-MM-DD");

  const newPost = {
    id: lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    createdAt: createdAt,
    count: 0,
  };
  dataPrs["result"].push(newPost);

  fs.writeFileSync("test.json", JSON.stringify(dataPrs), "utf-8");
  res.redirect("/list");
});

/* 게시글 수정하기 */
// 수정 화면 불러오기
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);
  let post = {};
  const posts = dataPrs["result"];

  posts.forEach((item) => {
    if (item["id"] == id) {
      post = item;
    }
  });

  res.render("edit", { post: post });
});

// 수정한 내용 저장하기
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;

  const data = fs.readFileSync("test.json", "utf-8");
  let dataPrs = JSON.parse(data);

  for (item of dataPrs["result"]) {
    if (item["id"] == id) {
      item["title"] = req.body.title;
      item["content"] = req.body.content;
      item["author"] = req.body.author;
      item["count"] = item["count"] ? item["count"] : 0;
    }
  }

  fs.writeFileSync("test.json", JSON.stringify(dataPrs), "utf-8");
  res.redirect(`/view/${id}`);
});

/* 게시글 삭제하기 */
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;

  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);

  let idxToDelete = 0;
  dataPrs["result"].forEach((item, idx) => {
    if (item["id"] == id) {
      idxToDelete = idx;
    }
  });
  dataPrs["result"].splice(idxToDelete, 1);

  fs.writeFileSync("test.json", JSON.stringify(dataPrs));
  res.redirect("/list");
});

const POST = 3000;
app.listen(POST, () => {
  console.log("Listening...");
});
