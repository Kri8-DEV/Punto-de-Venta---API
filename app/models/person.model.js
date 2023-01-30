module.exports = (sequelize, Sequelize) => {
  const Person = sequelize.define("persons", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    number: {
      type: Sequelize.STRING
    }
  });

  return Person;
};
