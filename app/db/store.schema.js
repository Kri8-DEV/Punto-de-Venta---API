module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define("stores", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(191),
      unique: { args: true, msg: "Email address already in use" },
      allowNull: false
    }
  });

  return Store;
}
