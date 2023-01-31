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
    let showDeactivated = req.query.showDeactivated ? req.query.showDeactivated == "true" : false;

    const users = await db.user.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
        active: showDeactivated ? { [Op.or]: [true, false] } : true
      },
    });

    res.status(200).send(users);
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Find a single User with an id
module.exports.findOne = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!user)
      throw { message: "User not found", status: 404 };

    res.status(200).send(user);
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

// Deactivate User
module.exports.deactivate = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!user)
      throw { message: "User not found", status: 404 };

    await user.update({
      active: false
    });

    res.send({ message: "User was deactivated successfully" });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Delete User
module.exports.delete = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        active: [true, false]
      }
    });

    if (!user)
      throw { message: "User not found", status: 404 };

    await user.destroy();

    res.send({ message: "User was deleted successfully" });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Update User
module.exports.update = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!user)
      throw { message: "User not found", status: 404 };

    const result = await sequelize.transaction(async (t) => {

        if (req.body.address == null)
          throw { message: "Address is required", status: 400 };

        if (req.body.person == null)
          throw { message: "Person is required", status: 400 };

        const role = db.ROLES[req.body.role]
        if (role == null)
          throw { message: "Role no found", status: 400 };

        const address = await user.person.address.update({
          street: req.body.address.street,
          city: req.body.address.city,
          state: req.body.address.state,
          zip: req.body.address.zip
        }, { transaction: t });

        const person = await user.person.update({
          name: req.body.person.name,
          number: req.body.person.number,
        }, { transaction: t });

        await person.setAddress(address, { transaction: t });

        await user.update({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : user.password,
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

      res.send({ message: "User was updated successfully", data: { user: result } });
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};