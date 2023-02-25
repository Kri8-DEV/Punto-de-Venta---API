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

describe('Auth', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {

      User.create({
        username: 'admin',
        email: 'admin@krieight.com',
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

  describe('/GET /api/users', () => {
    it('it should not get all users with invalid token', (done) => {
      chai.request(app)
        .get('/api/users')
        .set('Authorization', 'invalid-token')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message').eql('Unauthorized');
          done();
        });
    });

    it('it should get all users with valid token', (done) => {
      chai.request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer ' + authToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          done();
        });
      });
  });

  describe('/GET /api/user/:id', () => {
    let userId = 0;
    before((done) => {
      User.create({
        username: 'user',
        email: 'user@user.com',
        password: bcrypt.hashSync('user', 8),
        role: {
          id: ROLE_LIST.USER,
          name: "User"
        }
      }, {
        include: [Role]
      }).then((user) => {
        userId = user.id;
        done();
      });
    });

    it('it should get a user by id', (done) => {
      chai.request(app)
        .get('/api/user/' + userId)
        .set('Authorization', 'Bearer ' + authToken)
        .end((err, res) => {
          console.log('/api/user/' + userId);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('username').eql('user');
          expect(res.body).to.have.property('email').eql('user@user.com');
          done();
        });
    });
  });

  describe('/POST /api/user', () => {
    it('it should create a user', (done) => {
      chai.request(app)
        .post('/api/user/create')
        .set('Authorization', 'Bearer ' + authToken)
        .send({
          username: 'user 2',
          email: 'user2@user.com',
          password: bcrypt.hashSync('user', 8),
          role: "User",
          address: {
            street: "req.body.address.street",
            city: "req.body.address.city",
            state: "req.body.address.state",
            zip: "req.body.address.zip"
          },
          person: {
            name: "Rodrigo Sebastián",
            number: "777777777"
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.data.user).to.have.property('username').eql('user 2');
          done();
        });
    });

    it('it should not create a user with a higher role', (done) => {
      chai.request(app)
        .post('/api/user/create')
        .set('Authorization', 'Bearer ' + authToken)
        .send({
          username: 'user 3',
          email: 'user3@user.com',
          password: bcrypt.hashSync('user', 8),
          role: "Admin",
          address: {
            street: "req.body.address.street",
            city: "req.body.address.city",
            state: "req.body.address.state",
            zip: "req.body.address.zip"
          },
          person: {
            name: "Rodrigo Sebastián",
            number: "777777777"
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.be.a('object');
          done();
        });
    });
  });
});
