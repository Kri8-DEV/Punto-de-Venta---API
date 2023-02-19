const ROLE_LIST = require("./roleList.js");
const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports.initial = async function (db) {

  const Role = db.role;
  const User = db.user;

  await Role.create({
    id: ROLE_LIST.SUPERADMIN,
    name: "SuperAdmin"
  });

  await Role.create({
    id: ROLE_LIST.ADMIN,
    name: "Admin"
  });

  await Role.create({
    id: ROLE_LIST.USER,
    name: "User"
  });

  await User.create({
    username: process.env.ADMIN_USER,
    email: process.env.ADMIN_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    roleId: ROLE_LIST.SUPERADMIN
  });

  await User.create({
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

  console.log("Database seeded successfully");
  process.exit(0);
}
