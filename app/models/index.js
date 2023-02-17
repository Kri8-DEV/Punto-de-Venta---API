const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.DATABASE,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,
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

// Schemas
db.user = require('../db/user.schema')(sequelize, Sequelize);
db.role = require('../db/role.schema')(sequelize, Sequelize);
db.address = require('../db/address.schema')(sequelize, Sequelize);
db.person = require('../db/person.schema')(sequelize, Sequelize);
db.product = require('../db/product.schema')(sequelize, Sequelize);
db.refreshToken = require('../db/refreshToken.schema')(sequelize, Sequelize);
db.store = require('../db/store.schema')(sequelize, Sequelize);
db.stock = require('../db/stock.schema')(sequelize, Sequelize);

// Models
require('./user.model.js')(db);
require('./role.model.js')(db);
require('./address.model.js')(db);
require('./person.model.js')(db);
require('./product.model.js')(db);
require('./refreshToken.model.js')(db);
require('./store.model.js')(db);
require('./stock.model.js')(db);

module.exports = db;
