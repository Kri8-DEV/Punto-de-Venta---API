const controller = require("../controllers/auth.controller");
const verifySignUp = require("../middleware/verifySignUp");
const { authToken, authRole } = require("../middleware/authJwt");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/api/auth/signup',
  // [
    // authToken,
    // authRole("admin")
  // ],
  controller.signup);

  app.post('/api/auth/signin', controller.signin);
};
