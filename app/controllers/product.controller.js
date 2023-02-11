const db = require("../models");
const sequelize = db.sequelize;

const Op = db.Sequelize.Op;
const Product = db.product;

// Retrieve all Products from the database
module.exports.findAll = async (req, res) => {
  try {
    let showDeactivated = req.query.showDeactivated ? req.query.showDeactivated == "true" : false;

    const products = await db.product.findAll({
      where: {
        active: showDeactivated ? { [Op.or]: [true, false] } : true
      },
    });

    res.status(200).send(products);
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
}

// Find a single Product with an SKU
module.exports.findOne = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        sku: req.params.sku
      }
    });

    if (!product) throw { message: "Product not found", status: 404 };

    res.status(200).send(product);
  } catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Create and Save a new Product
module.exports.create = async (req, res) => {
  try {
    const product = await sequelize.transaction(async (t) => {
      const response = await Product.create({
        sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        kg_price: req.body.kg_price,
        image: req.body.image,
        weight: req.body.weight,
      }, { transaction: t });

      return response;
    });

    res.status(200).send({ message: "Product created successfully", data: { product: product } });
  } catch(err) {
    err.status = err.status || 500;
    res.status(err.status).send({ message: err.message });
  }
};

// Update a Product by the SKU in the request
module.exports.update = async (req, res) => {
  try {
    const product = await sequelize.transaction(async (t) => {
      const up_product = await Product.findOne({
        where: { sku: req.params.sku }
      }, { transaction: t });

      if (!up_product) throw { message: "Product not found", status: 404 };

      await up_product.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        kg_price: req.body.kg_price,
        image: req.body.image,
        weight: req.body.weight,
      }, {
        where: { sku: req.params.sku }
      }, { transaction: t });

      const response = await Product.findOne({
        where: { sku: up_product.sku }
      }, { transaction: t });

      return response;
    });

    if (!product) throw { message: "Product not found", status: 404 };

    res.status(200).send({ message: "Product updated successfully", data: { product: product } });
  } catch(err) {
    err.status = err.status || 500;
    res.status(err.status).send({ message: err.message });
  }
};

// Deactivate a Product with the specified SKU in the request
module.exports.deactivate = async (req, res) => {
  try {
    const product = await sequelize.transaction(async (t) => {

      const up_product = await Product.findOne({
        where: { sku: req.params.sku }
      }, { transaction: t });

      if (!up_product) throw { message: "Product not found", status: 404 };

      await up_product.update({
        active: false
      }, {
        where: { sku: req.params.sku }
      }, { transaction: t });

      return up_product;
    });

    res.status(200).send({ message: "Product deactivated successfully" });
  } catch(err) {
    err.status = err.status || 500;
    res.status(err.status).send({ message: err.message });
  }
};
