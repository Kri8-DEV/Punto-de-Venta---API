const { authToken } = require("../middleware/authJwt");
const { validateUserLevel } = require("../middleware/validateUserLevel");

module.exports = function(app) {
  // Swagger
  const swaggerUi = require('swagger-ui-express');
  var mergeYaml = require('merge-yaml');

  const fs = require('fs');
  let files = []
  if (fs.existsSync('./spec/requests')) {
    files = fs.readdirSync('./spec/requests')
  }
  const swaggerDocument = mergeYaml(['./swagger/swagger.yml'].concat(files.map(file => './spec/requests/' + file)))

  require('../routes/auth.routes')(app);

  // Development routes
  if (process.env.NODE_ENV === 'development') {
    app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'development') {
      res.redirect('/api/swagger');
    }
    else{
      res.json({ message: res.locals.t('welcome') });
    }
  });

  // Middleware for all routes below
  app.use([authToken, validateUserLevel]);
  require('../routes/user.routes')(app);
  require('../routes/product.routes')(app);
  require('../routes/customer.routes')(app);
  require('../routes/sale.routes')(app);
};
