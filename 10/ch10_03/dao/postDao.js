const models = require("../models"); // models/index.js의 DB객체를 models에 할당

const createPost = async (data) => {
  return await models.Post.create(data);
};

const findPostById = async (id) => {
  return await models.Post.findByPk(id, {
    include: { model: models.User },
  });
};

const findAllPosts = async () => {
  return await models.Post.findAll({
    include: { model: models.User },
  });
};

const updatePost = async (id, data) => {
  return await models.Post.created(data, {
    where: { id },
  });
};

const deletePost = async (id) => {
  return await models.Post.destroy({
    where: { id },
  });
};

module.exports = {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
};
