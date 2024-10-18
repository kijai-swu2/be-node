const postService = require("../services/postService");

const createPost = async (req, res) => {
  // 데이터를 가져올 때 오류가 나는 경우를 대비하기
  try {
    // const post = await postService.createPost(req.body);
    // userId를 토큰에서 가져오도록 수정
    const user = req.user;
    const post = await postService.createPost({
      title: req.body.title,
      content: req.body.content,
      userId: user.id,
    });
    res.status(201).json({ data: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findPostById = async (req, res) => {
  try {
    const post = await postService.findPostById(req.params.id);
    if (post) {
      res.status(200).json({ data: post });
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findAllPosts = async (req, res) => {
  try {
    const posts = await postService.findAllPosts();
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    if (post) {
      res.status(200).json({ data: post });
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost(req.param.id);
    if (result) {
      res.status(200).json({ message: "Post deleted." });
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
};
