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

  app.get('/api/users',
  [authToken,authRole("admin")],
  controller.findAll);

  app.post('/api/user/create',
  [authToken,authRole("admin")],
  controller.create);
};
