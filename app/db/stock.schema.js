module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define("stocks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sack_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kg_count: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    }
  });

  return Stock;
}
