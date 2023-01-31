// Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const db = require("./app/models");
const db_seed = require("./app/config/db.seed.js");

// Config
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN
};
app.use(cors(corsOptions));

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  db_seed.initial(db);
});

// Swagger
const swaggerUi = require('swagger-ui-express');
var mergeYaml = require('merge-yaml');

const fs = require('fs');
let files = []
if (fs.existsSync('./spec/requests')) {
  files = fs.readdirSync('./spec/requests')
}
const swaggerDocument = mergeYaml(['./swagger/swagger.yml'].concat(files.map(file => './spec/requests/' + file)))

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to KRI Eight - API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
