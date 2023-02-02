const db = require("../models");
const sequelize = db.sequelize;
const config = require("../config/auth.config");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = db.user;

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

    var token = jwt.sign({
      id: user.dataValues.id,
      role: user.dataValues.role.id,
    }, config.secret, {
      // expiresIn: 86400 // 24 hours
      expiresIn: 60 * 5 // 5 minutes
    });

    delete user.dataValues.password;
    res.status(200).send({ message: "Login successful", data: { token: token, user: user } });

  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  };
};
