const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const RegreshToken = sequelize.define("refreshToken", {
    token: {
      type: Sequelize.STRING,
    },
    expires: {
      type: Sequelize.DATE,
    },
  });


  RegreshToken.createToken = async function(user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

    let _token = uuidv4();

    let refreshToken = await this.create({
      token: _token,
      userId: user.id,
      expires: expiredAt.getTime(),
    });

    return refreshToken.token;
  };

  RegreshToken.verifyExpiration = (token) => {
    return token.expires.getTime() < new Date().getTime();
  };

  return RegreshToken;
};
