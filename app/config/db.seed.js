const ROLE_LIST = require("./role_list.js");
const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports.initial = function(db) {

  const Role = db.role;
  const User = db.user;
  const Person = db.person;
  const Address = db.address;


  Role.create({
    id: ROLE_LIST.SUPERADMIN,
    name: "SuperAdmin"
  });

  Role.create({
    id: ROLE_LIST.ADMIN,
    name: "Admin"
  });

  Role.create({
    id: ROLE_LIST.USER,
    name: "User"
  });

  User.create({
    username: process.env.ADMIN_USER,
    email: process.env.ADMIN_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    roleId: ROLE_LIST.SUPERADMIN
  });

  User.create({
    "username": "Isra KRI",
    "email": "Isra@krieight.com",
    "roleId": ROLE_LIST.ADMIN,
    "password": bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    "address": {
      "street": "req.body.address.street",
      "city": "req.body.address.city",
      "state": "req.body.address.state",
      "zip": "req.body.address.zip"
    },
    "person": {
      "name": "Rodrigo Sebastián",
      "number": "7271190177"
    }
  })
}
