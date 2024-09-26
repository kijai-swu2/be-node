console.clear();

// 모듈 불러오기 및 인스턴싱하기
const express = require("express");
const app = express();

// Http method, GET 요청 처리하기
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

/* 포트 설정 & 설정한 포트의 연결을 듣게 하기 */
const port = 3000;
app.listen(port, () => {
  console.log(`First Express app, listening on port ${port}`);
});
