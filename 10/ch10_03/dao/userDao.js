const models = require("../models");

const createUser = async (data) => {
  return await models.User.create(data);
};

const findAllUsers = async () => {
  return await models.User.findAll();
};

const findUserByEmail = async (email) => {
  return await models.User.findOne({
    where: { email },
  });
};

const updateUser = async (id, data) => {
  return await models.User.update(data, {
    where: { id },
  });
};

module.exports = {
  createUser,
  findAllUsers,
  findUserByEmail,
  updateUser,
};
