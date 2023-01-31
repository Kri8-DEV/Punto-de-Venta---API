const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports.initial = function(db) {

  const Role = db.role;
  const User = db.user;
  const Person = db.person;
  const Address = db.address;

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

  for(let i = 0; i < 10; i++){
    let address = Address.create({
      street: `street${i}`,
      city: `city${i}`,
      state: `state${i}`,
      zip: `zip${i}`
    });

    let person = Person.create({
      name: `name${i}`,
      number: `number${i}`,
      addressId: address.id
    });

    let user = User.create({
      username: `user${i}`,
      email: `user${i}@krieight.com`,
      password: bcrypt.hashSync(`12345678`, 8),
      role: "user",
      personId: person.id,
    });
  }
}
