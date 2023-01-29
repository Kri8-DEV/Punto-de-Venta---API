const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports.initial = function(db) {

  const Role = db.role;
  const User = db.user;

  db.ROLES = {}

  Role.create({
    id: 1,
    name: "admin"
  });
  db.ROLES["admin"] = 1;

  Role.create({
    id: 2,
    name: "user"
  });
  db.ROLES["user"] = 2;

  User.create({
    username: process.env.ADMIN_USER,
    email: process.env.ADMIN_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    roleId: 1
  });
}
