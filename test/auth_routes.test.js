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
        done();
      });
    });
  });

  describe('/POST signin', () => {
    it('it should login a user using username', (done) => {
      let user = {
        username: 'admin',
        password: 'admin'
      }
      chai.request(app)
        .post('/api/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message').eql('Login successful');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('user');
          done();
        });
    });

    it('it should login a user using email', (done) => {
      let user = {
        email: 'admin@krieight.com',
        password: 'admin'
      }
      chai.request(app)
        .post('/api/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message').eql('Login successful');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('user');
          done();
        });
    });

    it('it should not login a user with wrong password', (done) => {
      let user = {
        username: 'admin',
        password: 'wrongpassword'
      }
      chai.request(app)
        .post('/api/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message').eql('Invalid Password');
          done();
        });
    });

    it('it should not login a user with wrong username', (done) => {
      let user = {
        username: 'wrongusername',
        password: 'admin'
      }
      chai.request(app)
        .post('/api/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message').eql('User Not found');
          done();
        });
    });
  });

  describe('/POST refreshToken', () => {
    it('it should refresh token', (done) => {
      let user = {
        username: 'admin',
        password: 'admin'
      }
      chai.request(app)
        .post('/api/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.cookie('refreshToken');
          let refreshToken = res.header['set-cookie'][0].split(';')[0].split('=')[1];
          chai.request(app)
            .post('/api/auth/refreshtoken')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('message').eql('Access token refreshed');
              expect(res.body.data).to.have.property('token');
              done();
            });
        });
    });
  });

  describe('/POST logout', () => {
    it('it should logout a user', (done) => {
      let user = {
        username: 'admin',
        password: 'admin'
      }
      chai.request(app)
        .post('/api/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.cookie('refreshToken');
          let refreshToken = res.header['set-cookie'][0].split(';')[0].split('=')[1];
          chai.request(app)
            .post('/api/auth/logout')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.a('object');
              expect(res.body).to.have.property('message').eql('Logout successful');
              done();
            });
        });
    });
  });
});
