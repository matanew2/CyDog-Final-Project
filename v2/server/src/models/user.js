const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: function () {
        return this.role === "admin"
          ? ["read", "write", "delete"]
          : ["read", "write"];
      },
      validate: {
        areValidPermissions(value) {
          const allowed = ["read", "write", "delete"];
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error("Permissions must be a non-empty array");
          }
          for (const v of value) {
            if (!allowed.includes(v)) {
              throw new Error(
                "Permissions must be one of 'read', 'write', or 'delete'"
              );
            }
          }
        },
      },
    },
  },
  {
    tableName: "Users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeBulkCreate: async (users) => {
        for (const user of users) {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      },
    },
  }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

User.prototype.isAdmin = function () {
  return this.role === "admin";
};

module.exports = User;
