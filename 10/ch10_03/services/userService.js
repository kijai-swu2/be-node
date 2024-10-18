const userDao = require("../dao/userDao");

const createUser = async (data) => {
  return await userDao.createUser(data);
};

const findUserByEmail = async (email) => {
  return await userDao.findUserByEmail(email);
};

module.exports = {
  createUser,
  findUserByEmail,
};
