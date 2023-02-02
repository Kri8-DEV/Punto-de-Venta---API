const controller = require("../controllers/user.controller");
const { verifyRoles } = require("../middleware/verifyRoles");
const ROLE = require("../config/roleList");
const excludePaths = require("../config/excludePaths");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  excludePaths.push("/api/users");

  // Retrieve all Users
  app.get('/api/users',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.findAll);

  // Create a new User
  app.post('/api/user/create',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.create);

  // Retrieve a single User with id
  app.get('/api/user/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.findOne);

  // Deactivate a User with id
  app.delete('/api/user/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.deactivate);

  // Delete a User with id
  app.delete('/api/user/delete/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.delete);

  // Update a User with id
  app.put('/api/user/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.update);

  // Reactivate a User with id
  app.put('/api/user/reactivate/:id',
    verifyRoles(ROLE.SUPERADMIN, ROLE.ADMIN),
    controller.reactivate);
};
