const controller = require('../controllers/product.controller');
const { verifyRoles } = require('../middleware/verifyRoles');
const ROLE = require('../config/roleList');
const excludePaths = require('../config/excludePaths');

module.exports = function(app) {

  excludePaths.push('/api/products');

  // Retrieve all products
  app.get('/api/products',
  verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
  controller.findAll);

  // Retrieve a single product with sku
  app.get('/api/product/:sku',
  verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
  controller.findOne);

  // Create a new product
  app.post('/api/product/',
  verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
  controller.create);

  // Update a product with sku
  app.put('/api/product/:sku',
  verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
  controller.update);

  // Deactivate a product with sku
  app.delete('/api/product/:sku',
  verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
  controller.deactivate);
}
