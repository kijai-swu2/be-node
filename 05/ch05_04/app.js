console.clear();

const express = require("express");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

/* 라우터 설정 */
app.get("/list", (req, res) => {
  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);
  res.render("list", { posts: dataPrs["result"] });
});

app.get("/view/:id", (req, res) => {
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

  res.render("view", { post: post });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/edit", (req, res) => {
  res.render("edit");
});

const POST = 3000;
app.listen(POST, () => {
  console.log("Listening...");
});
