const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.post('/api/auth/signin', controller.signin);
  app.post('/api/auth/refreshtoken', controller.refreshToken);
  app.post('/api/auth/logout', controller.logout);
};
