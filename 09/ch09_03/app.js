const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/facebook");

const app = express();
app.use(express.json());

// DB 세팅하기
const db = mongoose.connection;
db.on("error", (err) => {
  // 에러 발생 시
  console.error(`error: ${err}`);
});
db.once("open", () => {
  // DB 연결 성공 시
  console.log(`Mongo successfully connected.`);
});

// Schema 설정하기
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  comments: [
    {
      comment: String,
      author: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const Post = mongoose.model("Post", PostSchema);

// 게시글 생성하기
app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const post = new Post({
      title: title,
      content: content,
      author: author,
    });
    await post.save();
    res.status(201).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 게시글 전체보기
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json({ data: posts });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 게시글 상세보기
app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 게시글 수정하기
app.put("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  try {
    const post = await Post.findById(id);
    console.log(post);
    if (post) {
      await Post.updateOne(
        { _id: id },
        {
          title: title,
          content: content,
        }
      );
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 게시글 삭제하기
app.delete("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (post) {
      await Post.deleteOne({ _id: id });
      res.status(201).send();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 댓글 생성하기
app.post("/posts/:id/comments", async (req, res) => {
  const id = req.params.id;
  const { comment, author } = req.body;
  try {
    const post = await Post.findById(id);
    if (post) {
      await Post.updateOne(
        { _id: id },
        {
          $push: {
            comments: {
              comment: comment,
              author: author,
            },
          },
        }
      );
      res.status(200).json({ data: post });
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 댓글 삭제하기
app.delete("/posts/:id/comments/:cid", async (req, res) => {
  const id = req.params.id;
  const cid = req.params.cid;
  try {
    const post = await Post.findById(id);
    if (!post) res.status(404).json({ error: "Comment not found." });
    await Post.updateOne(
      { _id: id },
      {
        $pull: {
          comments: { _id: cid },
        },
      }
    );
    res.status(201).send();
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const PORT = 3000;
app.listen(PORT);
