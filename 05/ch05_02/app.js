console.clear();

const express = require("express");
const { engine } = require("express-handlebars"); // express-handlebars 중 engine 모듈만 호출
const app = express();

/* Handlebars를 사용하기 위한 기본 설정들 */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  const data = {
    title: "Nice mustache! 🥸",
    message: "First Handlebars Example",
  };
  res.render("index", data);
});

const port = 3000;
app.listen(port, () => {
  console.log("Listening...");
});
