module.exports = (sequelize, Sequelize) => {
  const ExpiredAccessToken = sequelize.define('expired_access_tokens', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    expireAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  return ExpiredAccessToken;
}
