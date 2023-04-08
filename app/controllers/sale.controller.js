const db = require("../models");
const sequelize = db.sequelize;

const Sale = db.sale;

// Create a new sale
module.exports.create = async (req, res) => {
  try {
    const sale = await sequelize.transaction(async (t) => {
      const response = await Sale.create({
        customerId: req.body.customer_id,
        storeId: req.body.store_id,
        total: req.body.total,
        date: req.body.date,
      }, { transaction: t });

      return response;
    });

    res.status(200).send({ message: req.t("messages.model.sale.created"), data: { sale: sale } });
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Get all sales
module.exports.findAll = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: db.customer,
          as: "customer",
          attributes: ["id", "name"],
        },
        {
          model: db.store,
          as: "store",
          attributes: ["id", "name"],
        },
      ],
    });

    return res.status(200).send(sales);
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};

// Get one sale by id
module.exports.findOne = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.customer,
          as: "customer",
          attributes: ["id", "name"],
        },
        {
          model: db.store,
          as: "store",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!sale) throw { message: req.t("error.model.sale.not_found"), status: 404 };

    res.status(200).send(sale);
  }
  catch (error) {
    error.status = error.status || 500;
    res.status(error.status).send({ message: error.message });
  }
};
