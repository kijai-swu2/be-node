"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Model.associate = function (models) {
        models.Model.belongsTo(models.User, {
          foreignKey: "userId",
          onDelete: "CASCADE",
        });
        models.Model.belongsTo(models.Category, {
          foreignKey: "categoryId",
          onDelete: "SET NULL",
        });
      };
    }
  }
  Task.init(
    {
      title: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
