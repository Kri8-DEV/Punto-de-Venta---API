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

// Models
db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.address = require('./address.model')(sequelize, Sequelize);
db.person = require('./person.model')(sequelize, Sequelize);

// Relationships
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

db.address.hasMany(db.person);
db.person.belongsTo(db.address,{
  foreignKey: {
    name: 'addressId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

// Scopes
db.user.addScope('defaultScope', {
  attributes: {
    exclude: ["password", "personId", "roleId", "createdAt", "updatedAt"]
  },
  include: [
    { model: db.role, as: 'role' },
    { model: db.person, as: 'person', include: [
      { model: db.address, as: 'address' }
    ] }
  ]
}, { override: true });

db.role.addScope('defaultScope', {
  attributes: {
    exclude: ["createdAt", "updatedAt"]
  }
}, { override: true });

db.user.addScope('withPassword', {
  attributes: {
    include: ["password"]
  }
});

db.person.addScope('defaultScope', {
  attributes: { exclude: ['addressId', 'createdAt', 'updatedAt'] },
}, { override: true });

db.address.addScope('defaultScope', {
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}, { override: true });

module.exports = db;
