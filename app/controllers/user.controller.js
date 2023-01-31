const db = require("../models");
const sequelize = db.sequelize;
const config = require("../config/auth.config");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = db.user;
const Person = db.person;
const Address = db.address;
const Role = db.role;

// Retrieve all Users from the database
module.exports.findAll = async (req, res) => {
  try {
    const users = await db.user.findAll();

    res.status(200).send(users);
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Save User to database
module.exports.create = async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {

      if(req.body.password == null || req.body.password == "")
        throw { message: "Password is required", status: 400 };

      if (req.body.address == null)
        throw { message: "Address is required", status: 400 };

      if (req.body.person == null)
        throw { message: "Person is required", status: 400 };

      const role = db.ROLES[req.body.role]
      if (role == null)
        throw { message: "Role no found", status: 400 };

      const address = await Address.create({
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        zip: req.body.address.zip
      }, { transaction: t });

      const person = await Person.create({
        name: req.body.person.name,
        number: req.body.person.number,
      }, { transaction: t });

      await person.setAddress(address, { transaction: t });

      const encryptedPassword = bcrypt.hashSync(req.body.password, 8);
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: encryptedPassword,
      }, { transaction: t });

      await user.setPerson(person, { transaction: t });

      await user.setRole(role, { transaction: t });

      return User.findOne({
        where: {
          id: user.id
        },
        transaction: t
      });
    });

    res.send({ message: "User was created successfully", data: { user: result } });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};
