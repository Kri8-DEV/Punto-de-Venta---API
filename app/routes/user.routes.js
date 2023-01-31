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

  // app.use(authToken, authRole("admin"))

  // Retrieve all Users
  app.get('/api/users', controller.findAll);

  // Create a new User
  app.post('/api/user/create', controller.create);

  // Retrieve a single User with id
  app.get('/api/user/:id', controller.findOne);

  // Deactivate a User with id
  app.delete('/api/user/:id', controller.deactivate);

  // Delete a User with id
  app.delete('/api/user/delete/:id', controller.delete);

  // Update a User with id
  app.put('/api/user/:id', controller.update);
};
