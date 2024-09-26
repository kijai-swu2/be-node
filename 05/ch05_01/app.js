const express = require("express");
const app = express();

/* Pug를 사용하기 위한 기본 설정들 */
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  const data = {
    title: "This is title.",
    message: "Hello, Pug! 🐶",
  };
  res.render("index", data);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening to the ${port} port...`);
});
