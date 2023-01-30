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
      unique: { args: true, msg: "Email address already in use" },
      allowNull: false,
      validate: {
        isEmail: { args: true, msg: "Email address must be valid" },
        notNull: { args: true, msg: "Email address cannot be null" },
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: "Password cannot be null" },
        notEmpty: { args: true, msg: "Password is required" },
      }
    }
  });

  return User;
};
