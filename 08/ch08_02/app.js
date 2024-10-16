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

// 게시글 목록보기
app.get("/posts", async (req, res) => {
  const posts = await models.Post.findAll({
    include: [
      {
        model: models.Comment,
        require: true,
      },
    ],
  });
  res.json({ data: posts });
});

// 게시글 상세 보기
app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const post = await models.Post.findByPk(id);
  if (post) {
    res.status(200).json({ data: post });
  } else {
    res.status(400).json({ error: "Post not found" });
  }
});

// 게시글 수정하기
app.put("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const post = await models.Post.findByPk(id);
  if (post) {
    post.title = title;
    post.content = content;
    await post.save();
    res.status(200).json({ data: post });
  } else {
    res.status(405).json({ error: "Post not found." });
  }
});

// 게시글 삭제하기
app.delete("/posts/:id", async (req, res) => {
  // id를 변수로 선언하는 대신 조건절에서 바로 호출하기
  // const id = req.params.id;
  const result = await models.Post.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (result) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Post not found." });
  }
});

// 댓글 생성하기
app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const comment = await models.Comment.create({
    PostId: postId,
    content: content,
  });
  if (comment) {
    res.status(201).json({ data: comment });
  } else {
    res.status(400).json({ error: "Post not found" });
  }
});

// 댓글 전체보기
app.get("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const comments = await models.Comment.findAll({
    include: [{ model: models.Post }], // include를 사용해 댓글과 함께 Foreign key인 postId에 해당하는 게시글에 대한 정보를 조회하기
    where: {
      PostId: postId,
    },
  });
  if (comments) {
    res.status(201).json({ data: comments });
  } else {
    res.status(404).json({ error: "Post not found." });
  }
});

// 댓글 수정하기
app.put("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  const comment = await models.Comment.findByPk(id);
  if (comment) {
    comment.content = content;
    await comment.save();
    res.status(200).json({ udatedData: comment });
  } else {
    res.status(400).json({ error: "Comment not found." });
  }
});

// 댓글 삭제하기
app.delete("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const result = await models.Comment.destroy({
    where: {
      id: id,
    },
  });
  if (result) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Comment not found." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);

  // 데이터베이스와 모델을 동기화하기 - 동기화 실행 시 sync 메서드가 반환하는 Promise를 이용: 각각 성공 또는 실패 시 실행할 코드를 chaining해서 작성하기
  models.sequelize
    .sync({ force: false })
    .then(() => {
      // 동기화가 성공적으로 완료될 경우에 처리할 코드: 콘솔에 출력하기
      console.log(`DB connected using ORM...`);
    })
    .catch((err) => {
      // 동기화가 실패할 경우에 처리할 코드: 오류를 출력하고 앱을 종료하기
      console.log(`DB Error: ${err}`);
      process.exit();
    });
});
