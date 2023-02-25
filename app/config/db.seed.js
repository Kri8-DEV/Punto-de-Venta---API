const ROLE_LIST = require("./roleList.js");
const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports.initial = async function (db) {

  const Role = db.role;
  const User = db.user;
  const Person = db.person;
  const Address = db.address;

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

  const address = await Address.create({
    street: "1234 Main St",
    city: "San Diego",
    state: "CA",
    zip: "92101"
  });

  await User.create({
    "username": "Isra KRI",
    "email": "Isra@krieight.com",
    "password": bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    "roleId": ROLE_LIST.ADMIN,
    "person": {
      "name": "Israel Sanchez",
      "number": "7777777777",
      "addressId": address.id
    }

  }, {
    include: [ Person ]
  });

  await User.create({
    "username": "Rodrigo KRI",
    "email": "rodrigo@krieight.com",
    "password": bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
    "roleId": ROLE_LIST.USER,
    "person": {
      "name": "Rodrigo De la Rosa",
      "number": "7777777777",
      "addressId": address.id
    }
  }, {
    include: [ Person ]
  });

  console.log("Database seeded successfully");
  process.exit(0);
}
