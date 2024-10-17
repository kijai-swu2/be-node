const postDao = require("../dao/postDao");

const createPost = async (data) => {
  return await postDao.createPost(data);
};
const findPostById = async (id) => {
  return await postDao.findPostById(id);
};
const findAllPosts = async () => {
  return await postDao.findAllPosts();
};
const updatePost = async (id, data) => {
  return await postDao.updatePost(id, data);
};
const deletePost = async (id) => {
  return await postDao.deletePost(id);
};

module.exports = {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
};
