const express = require("express");
const path = require("path");
const models = require("./models"); // index.js 파일에 있는 모델들을 한번에 호출하기
const exp = require("constants");

const app = express();
app.use(express.json());

// 게시글 생성하기 - await로 설정된 ORM의 create 메서드가 실행되는 시점에 맞춰 async 함수를 실행하기
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;
  // await로 기다릴 대상 설정하기
  const post = await models.Post.create({
    title: title,
    content: content,
    author: author,
  });
  res.status(201).json(post);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);

  // 데이터베이스와 모델을 동기화하기 - 동기화 실행 시 sync 메서드가 반환하는 Promise를 통해서 성공 시 실행 코드, 실패 시 실행 코드를 chaining해서 작성하기
  models.sequelize
    .sync({ force: false })
    .then(() => {
      // 동기화가 성공적으로 완료될 경우에 비동기 처리 코드를 실행하기
      console.log(`DB connected using ORM...`);
    })
    .catch((err) => {
      // 동기화가 실패할 경우에 오류를 출력하고 앱을 종료하기
      console.log(`DB Error: ${err}`);
      process.exit();
    });
});
