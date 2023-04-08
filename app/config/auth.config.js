require('dotenv').config();

module.exports = {
  ACCESS_TOKEN_SECRET: process.env.AUTH_SECRET,
  jwtExpiration: 60 * 15,
  jwtRefreshExpiration: 86400,
};
