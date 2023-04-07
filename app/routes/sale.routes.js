const controller = require("../controllers/sale.controller");
const { verifyRoles } = require("../middleware/verifyRoles");
const ROLE = require("../config/roleList");
const excludePaths = require("../config/excludePaths");

module.exports = function (app) {
  // Retrieve all Sales
  app.get('/api/sales',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.findAll
  );

  // Retrieve a single Sale with id
  app.get('/api/sale/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.findOne
  );

  // Create a new Sale
  app.post('/api/sales/new',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.create
  );

};
