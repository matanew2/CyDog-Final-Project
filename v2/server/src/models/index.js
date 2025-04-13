const sequelize = require("../config/db");
const User = require("./user");
const Dog = require("./dog");
const Assignment = require("./assignment");

// Define associations
User.hasMany(Dog, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Dog.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Assignment, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Assignment.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Dog.hasMany(Assignment, {
  foreignKey: "dogId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Assignment.belongsTo(Dog, {
  foreignKey: "dogId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = {
  sequelize,
  User,
  Dog,
  Assignment,
};
