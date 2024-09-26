console.clear();

// 모듈 불러오기 및 인스턴싱하기
const express = require("express");
const app = express();

// Http method, GET 요청 처리하기
app.get("/home", (req, res) => {
  res.send(`
    <h1>Welcome</h1>
    <h2>This is our home!</h2>
    `);
});

// 포트 설정 & 설정한 포트의 연결을 듣게 하기
const port = 3000;
app.listen(port, () => {
  console.log("Listening...");
});
