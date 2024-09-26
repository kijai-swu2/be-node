console.clear();

const express = require("express");
const fs = require("fs");
const app = express();

/* EJS를 사용하기 위한 기본 설정들 */
app.set("view engine", "ejs"); // 템플릿 엔진을 EJS로 설정하기
app.set("views", "./views"); // 템플릿을 불러올 디렉토리 설정하기

/* URI 별 실행 함수 정의하기 */
app.get("/", (req, res) => {
  const data = {
    title: "EJS Example",
    message: "Finally EJS",
  };
  res.render("index", data); // Response에 data의 내용을 담아 전송하기
});

app.get("/for", (req, res) => {
  res.render("for");
});

app.get("/if", (req, res) => {
  res.render("if");
});

app.get("/test", (req, res) => {
  const data = fs.readFileSync("test.json", "utf-8");
  const dataPsd = JSON.parse(data);
  res.render("test", { posts: dataPsd["result"] });
});

const port = 3000;
app.listen(port, () => {
  console.log("Listening...");
});
