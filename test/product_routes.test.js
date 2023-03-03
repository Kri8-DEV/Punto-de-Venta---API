const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../server');
const db = require('../app/models');
const bcrypt = require("bcryptjs");
const ROLE_LIST = require("../app/config/roleList");

const User = db.user;
const Role = db.role;

chai.use(chaiHttp);
let authToken = ''
let sku = ''

describe('Products', () => {
  describe('/POST /api/product', () => {
    before((done) => {
      db.sequelize.sync({ force: true }).then(() => {
        User.create({
          username: 'admin',
          email: 'admin@admin.com',
          password: bcrypt.hashSync('admin', 8),
          role: {
            id: ROLE_LIST.ADMIN,
            name: "Admin"
          }
        }, {
          include: [Role]
        }).then(() => {
          chai.use(chaiHttp).request(app)
            .post('/api/auth/signin')
            .send({
              username: 'admin',
              password: 'admin'
            })
            .end((err, res) => {
              authToken = res.body.data.token;
              done();
            });
        });
      });
    });

    it('it shoudl create a new product', (done) => {
      product = {
        "sku": "123456789",
        "name": "Product 1",
        "description": "Product 1 description",
        "price": 10.00,
        "kg_price": 10.00,
        "image": "",
        "weight": 20,
        "active": true
      }

      chai.request(app)
        .post('/api/product/')
        .set('Authorization', 'Bearer ' + authToken)
        .send(product)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data.product).to.have.property('sku');
          expect(res.body.data.product).to.have.property('name');
          expect(res.body.data.product).to.have.property('description');
          done();
        });
    });
  });

  describe('/GET /api/products', () => {
    it('it should get all products', (done) => {
      chai.request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer ' + authToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          sku = res.body[0].sku;
          done();
        });
    });
  });

  describe('/GET /api/product/:sku', () => {
    chai.request(app)
      .get('/api/product/' + sku)
      .set('Authorization', 'Bearer ' + authToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data.product).to.have.property('sku');
        expect(res.body.data.product).to.have.property('name');
        expect(res.body.data.product).to.have.property('description');
        done();
      });
    });
});
