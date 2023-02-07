const db = require("../models");
const sequelize = db.sequelize;
const config = require("../config/auth.config");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = db.user;
const RefreshToken = db.refreshToken;

// Sign in
module.exports.signin = async (req, res) => {
  try{
    const user = await sequelize.transaction(async (t) => {

      const response = await User.scope(["defaultScope","withPassword"]).findOne({
        where: {
          [Op.or]: [{username: req.body.username}, {email: req.body.username}]
        },
        transaction: t
      });

      return response;
    });

    if (!user) return res.status(404).send({ message: "User Not found" });

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.dataValues.password
    );

    if (!passwordIsValid) return res.status(401).send({ message: "Invalid Password" });

    const token = jwt.sign({
      id: user.dataValues.id,
      role: user.dataValues.role.id,
    }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.jwtExpiration
    });

    let refreshToken = await RefreshToken.createToken(user);

    delete user.dataValues.password;
    res.status(200).send({ message: "Login successful", data: { token: token, refreshToken: refreshToken , user: user } });

  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  };
};

// Refresh token
module.exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken  == null) return res.status(400).send({ message: "Refresh token is required" });

  try {
    let refreshToken = await RefreshToken.findOne({
      where: {
        token: requestToken
      }
    });

    if (!refreshToken) return res.status(403).send({ message: "Refresh token is invalid" });

    if(RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      return res.status(403).send({ message: "Refresh token is expired. Please login again" });
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({
      id: user.id,
      role: user.role.id,
    }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.jwtExpiration
    });

    return res.status(200).send({ message: "Access token refreshed", data: { token: newAccessToken, refreshToken: refreshToken.token } });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  };
};
