module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING(191),
      unique: { args: true, msg: "Username already in use" },
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Username is required" },
      }
    },
    email: {
      type: Sequelize.STRING(191),
      unique: { args: true, msg: "Email address already in use" }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Password cannot be null" },
        notEmpty: { args: true, msg: "Password is required" },
      }
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
  });

  return User;
};
