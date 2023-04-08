module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sales", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE
    },
    total: {
      type: Sequelize.DECIMAL(10, 2)
    }
  });

  return Sale;
};
