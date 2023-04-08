const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refresh_tokens", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId:{
      type: Sequelize.UUID,
      allowNull: false,
      foreignKey: true,
      unique: true,
    },
    token: {
      type: Sequelize.STRING(191),
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
    }
  });


  RefreshToken.createToken = async function(user) {
    try {
      let expiredAt = new Date();

      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

      let _token = uuidv4();

      let refreshToken = await this.create({
        token: _token,
        userId: user.id,
        expires: expiredAt.getTime(),
      });

      return refreshToken;
    } catch(error) {
      error.status = error.status || 500;
      if (error.name === "SequelizeUniqueConstraintError")
        error.message = "SequelizeUniqueConstraintError";
      throw { message: error.message, status: error.status };
    }
  };

  RefreshToken.verifyExpiration = (token) => {
    return new Date(token.exp * 1000).getTime() < new Date().getTime();
  };

  return RefreshToken;
};
