const db = require("../models");
const sequelize = db.sequelize;

const Customer = db.customer;
const Address = db.address;
const Person = db.person;

// Create a new customer
module.exports.create = async (req, res) => {
  try {
    const customer = await sequelize.transaction(async (t) => {
      if (req.body.address == null)
        throw { message: req.t("error.model.customer.address_required"), status: 400 };

      if (req.body.person == null)
        throw { message: req.t("error.model.customer.person_required"), status: 400 };

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

      const customer = await Customer.create({
        personId: person.id,
      }, { transaction: t });

      return Customer.findOne({
        where: { id: customer.id },
         transaction: t
      });
    });

    res.status(200).send({ message: req.t("messages.model.customer.created"), data: { customer: customer } });
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}

// Get all customers
module.exports.findAll = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    res.status(200).send(customers);
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}

// Get a single customer
module.exports.findOne = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!customer)
      throw { message: req.t("error.model.customer.not_found"), status: 404 };

    res.status(200).send(customer);
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}

// Update a customer
module.exports.update = async (req, res) => {
  try {
    const customer = await sequelize.transaction(async (t) => {

      if (req.body.address == null)
        throw { message: req.t("error.model.customer.address_required"), status: 400 };

      if (req.body.person == null)
        throw { message: req.t("error.model.customer.person_required"), status: 400 };

      const address = await Address.update({
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        zip: req.body.address.zip
      }, {
        where: {
          id: req.body.address.id
        },
        transaction: t
      });

      const person = await Person.update({
        name: req.body.person.name,
        number: req.body.person.number,
      }, {
        where: {
          id: req.body.person.id
        },
        transaction: t
      });

      const customer = await Customer.update({
        personId: person.id,
      }, {
        where: {
          id: req.params.id
        },
        transaction: t
      });

      return Customer.findOne({
        where: { id: req.params.id },
         transaction: t
      });
    });

    res.status(200).send({ message: req.t("messages.model.customer.updated"), data: { customer: customer } });
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}
