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
          [Op.or]: [{username: req.body.username || ""}, {email: req.body.email || ""}]
        },
        transaction: t
      });

      return response;
    });

    if (!user) return res.status(404).send({ message: req.t("error.model.user.not_found") });

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.dataValues.password
    );

    if (!passwordIsValid) return res.status(401).send({ message: req.t("error.model.user.invalid_password") });

    const token = jwt.sign({
      id: user.dataValues.id,
      role: user.dataValues.role.id,
    }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.jwtExpiration
    });

    let refreshToken = await RefreshToken.createToken(user);

    delete user.dataValues.password;

    res.status(200).send({ message: req.t("messages.model.user.login"), data: { token: token, user: user } });

  } catch (error) {
    error.status = error.status || 500;
    if (error.message.includes("SequelizeUniqueConstraintError")) {
      error.status = 400;
      error.message = req.t("error.model.auth.login.already_logged_in");
    }
    res.status(error.status).send({ message: error.message });
  };
};

// Refresh token
module.exports.refreshToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(403).send({ message: req.t("error.model.auth.user.missing") });

    let refreshToken = await RefreshToken.findOne({
      where: {
        userId: userId
      }
    });

    if (!refreshToken) return res.status(403).send({ message: req.t("error.model.auth.refresh_token.invalid") });

    if(RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      return res.status(403).send({ message: req.t("error.model.auth.refresh_token.expired") });
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({
      id: user.id,
      role: user.role.id,
    }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.jwtExpiration
    });

    return res.status(200).send({ message: req.t("messages.model.auth.refresh_token.refreshed"), data: { token: newAccessToken } });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  };
};

// Logout
module.exports.logout = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(403).send({ message: req.t("error.model.auth.user.missing") });

    let refreshToken = await RefreshToken.findOne({
      where: {
        userId: userId
      }
    });

    if (!refreshToken) return res.status(403).send({ message: req.t("error.model.auth.refresh_token.invalid") });

    RefreshToken.destroy({ where: { userId: refreshToken.userId } });

    res.clearCookie("refreshToken");
    res.status(200).send({ message: req.t("messages.model.auth.logout") });
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}
