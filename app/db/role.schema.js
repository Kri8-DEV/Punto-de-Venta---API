module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      required: true,
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return Role;
};
