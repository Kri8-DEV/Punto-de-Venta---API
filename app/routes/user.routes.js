const controller = require("../controllers/user.controller");
const { authToken, authRole } = require("../middleware/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Retrieve all Users
  app.get('/api/users',
  // [authToken,authRole("admin")],
  controller.findAll);

  // Create a new User
  app.post('/api/user/create',
  // [authToken,authRole("admin")],
  controller.create);

  // Retrieve a single User with id
  app.get('/api/user/:id',
  // [authToken,authRole("admin")],
  controller.findOne);

  // Deactivate a User with id
  app.delete('/api/user/:id',
  // [authToken,authRole("admin")],
  controller.deactivate);

  // Delete a User with id
  app.delete('/api/user/delete/:id',
  // [authToken,authRole("admin")],
  controller.delete);
};
