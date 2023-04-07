const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
if (process.env.NODE_ENV === 'test') {
  config.DATABASE = config.TEST_DATABASE;
}

const sequelize = new Sequelize(
  config.DATABASE,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    logging: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? false : console.log,
    operatorsAliases: 0,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  },
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
db.refreshToken = require('../db/refresh_token.schema')(sequelize, Sequelize);
db.expiredAccessToken = require('../db/expired_access_token.schema')(sequelize, Sequelize);
db.store = require('../db/store.schema')(sequelize, Sequelize);
db.stock = require('../db/stock.schema')(sequelize, Sequelize);
db.customer = require('../db/customer.schema')(sequelize, Sequelize);
db.sale = require('../db/sale.schema')(sequelize, Sequelize);
db.saleDetail = require('../db/sale_detail.schema')(sequelize, Sequelize);

// Models
require('./user.model.js')(db);
require('./role.model.js')(db);
require('./address.model.js')(db);
require('./person.model.js')(db);
require('./product.model.js')(db);
require('./refresh_token.model.js')(db);
require('./expired_access_token.model.js')(db);
require('./store.model.js')(db);
require('./stock.model.js')(db);
require('./customer.model.js')(db);
require('./sale.model.js')(db);
require('./sale_detail.model.js')(db);

module.exports = db;
