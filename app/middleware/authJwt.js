const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

const User = db.user;

let authToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided"
    });
  }

  token = token.replace('Bearer ', '');
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

let authRole = (role) => {
  return (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      if(!user) {
        res.status(404).send({
          message: "User Not found."
        });
        return;
      }

      if (db.ROLES[role] == null) {
        res.status(400).send({
          message: "Role does not exist = " + role
        });
      }

      if(db.ROLES[role] === user.role.id) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require admin Role"
      });
      return;
    });
  }
};

module.exports = {
  authToken,
  authRole
};
