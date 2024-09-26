console.clear();

/* 모듈 불러오기 및 인스턴싱하기 */
const express = require("express");
const fs = require("fs");
const app = express();

/* Http method, GET 요청 처리하기 */
app.get("/list", (req, res) => {
  list(req, res);
});

app.get("/view/:id", (req, res) => {
  // URI에 id 값 전달하기
  view(req, res);
});

/* GET에서 실행할 함수 정의하기 */
const list = (req, res) => {
  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);

  // 데이터를 JSON 형태로 다시 변환해 클라이언트에게 전달하기
  res.json(dataPrs);
};

const view = (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync("test.json", "utf-8");
  const dataPrs = JSON.parse(data);

  // json 안의 result 배열을 불러오기
  const posts = dataPrs["result"];

  // 배열을 순환하며 id가 같은 게시글을 찾아서 post라는 객체에 집어넣기
  let post = {};
  posts.forEach((item) => {
    if (item.id == id) {
      post = item;
    }
  });

  // post 객체를 JSON 형태로 다시 변환해 클라이언트에게 전달하기
  res.json(post);
};

/* 포트 설정 & 설정한 포트의 연결을 듣게 하기 */
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
