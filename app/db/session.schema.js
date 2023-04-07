const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("sessions", {
    userId:{
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      foreignKey: true
    },
    token: {
      type: Sequelize.STRING(191),
      allowNull: false,
      primaryKey: true
    },
    expires: {
      type: Sequelize.DATE,
    },
  });


  Session.createToken = async function(user) {
    try {
      let expiredAt = new Date();

      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

      let _token = uuidv4();

      let session = await this.create({
        token: _token,
        userId: user.id,
        expires: expiredAt.getTime(),
      });

      return session.token;
    } catch(error) {
      error.status = error.status || 500;
      if (error.name === "SequelizeUniqueConstraintError")
        error.message = "SequelizeUniqueConstraintError";
      throw { message: error.message, status: error.status };
    }
  };

  Session.verifyExpiration = (token) => {
    return token.expires.getTime() < new Date().getTime();
  };

  return Session;
};
