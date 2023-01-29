const db = require("../models");
const config = require("../config/auth.config");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = db.user;
const Role = db.role;

// Save User to database
module.exports.signup = (req, res) => {
  role = db.ROLES[req.body.role];
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    roleId: role ? role : db.ROLES["user"]
  }).then(user => {
    delete user.dataValues.password;
    res.send({ message: "User was registered successfully", user: user });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

// Sign in
module.exports.signin = (req, res) => {
  User.findOne({
    where: {
      [Op.or]: [{username: req.body.username}, {email: req.body.username}]
    },
    include: [{ model: Role, as: "role" }]
  }).then(user => {
    if (!user) return res.status(404).send({ message: "User Not found." });

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) return res.status(401).send({ message: "Invalid Password" });

    var token = jwt.sign({ id: user.id }, config.secret, {
      // expiresIn: 86400 // 24 hours
      expiresIn: 60 * 5 // 5 minutes
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      accessToken: token
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};
