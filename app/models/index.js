const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.DATABASE,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.address = require('./address.model')(sequelize, Sequelize);
db.person = require('./person.model')(sequelize, Sequelize);

db.address.hasMany(db.person);
db.person.belongsTo(db.address,{
  foreignKey: {
    name: 'addressId',
    allowNull: false
  },
  onDelete: 'CASCADE'
}); 

db.person.hasOne(db.user);
db.user.belongsTo(db.person,{
  foreignKey: {
    name: 'personId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

db.role.hasMany(db.user);
db.user.belongsTo(db.role,{
  foreignKey: {
    name: 'roleId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

module.exports = db;
