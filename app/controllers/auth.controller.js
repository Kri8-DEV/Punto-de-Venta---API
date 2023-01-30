const db = require("../models");
const sequelize = db.sequelize;
const config = require("../config/auth.config");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const User = db.user;
const Role = db.role;
const Address = db.address;
const Person = db.person;

// Save User to database
module.exports.signup = async (req, res) => {
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

    res.send({ message: "User was registered successfully", user: result });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

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

    var token = jwt.sign({ id: user.dataValues.id }, config.secret, {
      // expiresIn: 86400 // 24 hours
      expiresIn: 60 * 5 // 5 minutes
    });

    delete user.dataValues.password;
    res.status(200).send({ message: "Login successful", token: token, user: user });

  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  };
};
