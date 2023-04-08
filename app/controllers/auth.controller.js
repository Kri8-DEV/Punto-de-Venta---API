const db = require("../models");
const sequelize = db.sequelize;
const config = require("../config/auth.config");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = db.user;
const RefreshToken = db.refreshToken;
const ExpiredAccessToken = db.expiredAccessToken;

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

    let refreshToken = await RefreshToken.createToken(user);

    const token = jwt.sign({
      id: user.dataValues.id,
      role: user.dataValues.role.id,
      rTId: refreshToken.id
    }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.jwtExpiration
    });

    delete user.dataValues.password;

    res.setHeader("Authorization", token);
    return res.status(200).send({ message: req.t("messages.model.user.login"), data: { user: user } });

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
    const _token = await sequelize.transaction(async (t) => {
      let token = req.headers["authorization"]

      if(!token?.startsWith("Bearer ")) throw { message: req.t("error.model.auth.jwt.missing"), status: 401 }

      token = token.replace('Bearer ', '');
      const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET, { ignoreExpiration: true });

      if (RefreshToken.verifyExpiration(decoded)) {
        let refreshToken = await RefreshToken.findOne({
          where: {
            userId: decoded.id
          }
        });

        if (!refreshToken) throw { message: req.t("error.model.auth.refresh_token.invalid_session"), status: 403}

        if (refreshToken.expires.getTime() < new Date().getTime()) {
          RefreshToken.destroy({ where: { id: refreshToken.id } });
          throw { message: req.t("error.model.auth.refresh_token.expired"), status: 403}
        }

        const expiredToken = await ExpiredAccessToken.findOne({
          where: {
            userId: decoded.id,
            token: token
          }
        });

        if (expiredToken) throw { message: req.t("error.model.auth.refresh_token.invalid"), status: 403}

        await ExpiredAccessToken.create({
          token: token,
          userId: decoded.id,
        }, { transaction: t });

        token = jwt.sign({
          id: decoded.id,
          role: decoded.role,
        }, config.ACCESS_TOKEN_SECRET, {
          expiresIn: config.jwtExpiration
        });
      }

      return token
    });

    res.setHeader("Authorization", _token);
    return res.status(200).send({ message: req.t("messages.model.auth.refresh_token.refreshed") });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  };
};

// Logout
module.exports.logout = async (req, res) => {
  try {
    let token = req.headers["authorization"]

    if(!token?.startsWith("Bearer ")) throw { message: req.t("error.model.auth.jwt.missing"), status: 401 }

    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if(err) throw { message: req.t("error.model.auth.jwt.invalid"), status: 403 };
      return decoded;
    });

    let refreshToken = await RefreshToken.findOne({
      where: {
        userId: decoded.id,
        id: decoded.rTId
      }
    });

    if (!refreshToken) throw { message: req.t("error.model.auth.refresh_token.invalid"), status: 403}

    RefreshToken.destroy({ where: { id: refreshToken.id } });

    res.clearCookie("refreshToken");
    res.status(200).send({ message: req.t("messages.model.auth.logout") });
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}
