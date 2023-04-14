# KRI Api
Generic API made with NodeJS, Express and MySQL
Version: 1.7.0
Autor: KRI Eight Team

## Installation
Install all the next dependencies for the project:
- nodemon
- express
- mysql2
- cors
- morgan
- dotenv
- body-parser
- bcryptjs
- jsonwebtoken
- sequelize
- uuid
- cookie-parser
- i18n-node-yaml
- json-api-serializer

```npm i json-api-serializer nodemon express mysql2 cors morgan dotenv body-parser bcryptjs jsonwebtoken sequelize uuid cookie-parser i18n-node-yaml --save```

Install Swagger dependencies:
- swagger-jsdoc
- swagger-ui-express
- merge-yaml

```npm i swagger-jsdoc swagger-ui-express merge-yaml --save-dev```

Install the next dependencies for the tests:
- mocha
- chai
- chai-http

```npm i mocha chai chai-http --save-dev```

## Usage
Run the next command to start the server:
- ```npm start```

Sync the database:
- ```npm run sync_db```

Run with nodemon for development:
- ```npm run dev```

Run the tests:
- ```npm run test```

- ```npm run test ./test/your_test.js```
