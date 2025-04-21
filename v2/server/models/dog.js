// Updated Dog model with hlsUrl field (models/dog.js)

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Dog = sequelize.define(
  "Dog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hlsUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL to the HLS stream for this dog",
    },
  },
  {
    tableName: "Dogs",
  }
);

module.exports = Dog;