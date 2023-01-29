// Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

// Config
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.CORS_ORIGIN
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to KRI Eight - API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
