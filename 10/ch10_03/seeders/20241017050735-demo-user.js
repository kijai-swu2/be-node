"use strict";

const { query } = require("express");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "admin",
        email: "admin@a.com",
        password: "admin1234",
        address: "Seoul, South Korea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User 1",
        email: "user01@a.com",
        password: "1234",
        address: "Seoul, South Korea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User 2",
        email: "user02@a.com",
        password: "1234",
        address: "Seoul, South Korea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User 3",
        email: "user03@a.com",
        password: "1234",
        address: "Seoul, South Korea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
