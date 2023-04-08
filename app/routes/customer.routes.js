const controller = require("../controllers/customer.controller");
const { verifyRoles } = require("../middleware/verifyRoles");
const ROLE = require("../config/roleList");
const excludePaths = require("../config/excludePaths");

module.exports = function (app) {

  // Retrieve all Customers
  app.get('/api/customers',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.findAll
  );

  // Retrieve a single Customer with id
  app.get('/api/customer/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.findOne
  );

  // Create a new Customer
  app.post('/api/customer/',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.create
  );

  // Update a Customer with id
  app.put('/api/customer/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER),
    controller.update
  );
};
