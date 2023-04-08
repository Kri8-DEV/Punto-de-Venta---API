module.exports = (sequelize, Sequelize) => {
  const SaleDetail = sequelize.define("sale_details", {
    saleId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      foreignKey: true
    },
    productSku:{
      type: Sequelize.STRING(191),
      allowNull: false,
      primaryKey: true,
      foreignKey: true
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    price: {
      type: Sequelize.DECIMAL(10, 2)
    }
  });

  return SaleDetail;
}
