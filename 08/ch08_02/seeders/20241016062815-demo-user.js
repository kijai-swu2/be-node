"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "admin",
        email: "admin@a.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User 1",
        email: "user1@a.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete("Users", null, {});
  },
};
