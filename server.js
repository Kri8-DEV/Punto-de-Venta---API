// Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const db = require("./app/models");
const db_seed = require("./app/config/db.seed.js");
const { authToken } = require("./app/middleware/authJwt.js");
const { validateUserLevel } = require("./app/middleware/validateUserLevel.js");

// Config
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN
};
app.use(cors(corsOptions));

// Internationalization
const i18n = require('i18n-node-yaml')({
  translationFolder: './locales',
  locales: ['en', 'es'],
  defaultLocale: 'es',
  queryParameter: 'lang'
})

i18n.ready.catch((err) => {
  console.log('Failed loading translations',err);
});

// Database
if (process.env.NODE_ENV === 'test') {
  console.log('Using test database: ' + process.env.DB_TEST_DATABASE);
}
if (process.env.NODE_ENV === 'development' && process.env.DB_SYNC === 'true') {
  db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    db_seed.initial(db);
  });
}

// Swagger
const swaggerUi = require('swagger-ui-express');
var mergeYaml = require('merge-yaml');

const fs = require('fs');
let files = []
if (fs.existsSync('./spec/requests')) {
  files = fs.readdirSync('./spec/requests')
}
const swaggerDocument = mergeYaml(['./swagger/swagger.yml'].concat(files.map(file => './spec/requests/' + file)))

// Middleware for all routes
  app.use(i18n.middleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

// Routes
  require('./app/routes/auth.routes')(app);
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
  require('./app/routes/user.routes')(app);
  require('./app/routes/product.routes')(app);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

// Export for testing
if(process.env.NODE_ENV === 'test') {
  module.exports = app;
}
