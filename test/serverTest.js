const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

// Test suite for /api/authenticate
describe('/api/authenticate', () => {
  it('should return a JWT token on successful authentication', (done) => {
    chai
      .request(app)
      .post('/api/authenticate')
      .send({ email: 'shobham.rajak@gmail.com', password: 'password' }) // Replace with dummy email and password
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should return an error for invalid credentials', (done) => {
    chai
      .request(app)
      .post('/api/authenticate')
      .send({ email: 'shobham.rajak@gmail.com', password: 'wrongpassword' }) // Replace with dummy email and wrong password
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

// Test suite for /api/follow/{id}
describe('/api/follow/{id}', () => {
  it('should follow a user with the given id', (done) => {
    chai
      .request(app)
      .post('/api/follow/2') // Replace with the user id to follow
      .send({ user: {id:'1'}})
    //   .set('Authorization', 'Bearer <jwt-token>') // Replace with a valid JWT token for authentication
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should return an error for unauthorized access', (done) => {
    chai
      .request(app)
      .post('/api/follow/123') // Replace with the user id to follow
      .send({ user: {id:'1'}})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

// // Test suite for /api/unfollow/{id}
// describe('/api/unfollow/{id}', () => {
//   it('should unfollow a user with the given id', (done) => {
//     chai
//       .request(app)
//       .post('/api/unfollow/123') // Replace with the user id to unfollow
//       .set('Authorization', 'Bearer <jwt-token>') // Replace with a valid JWT token for authentication
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('message');
//         done();
//       });
//   });

//   it('should return an error for unauthorized access', (done) => {
//     chai
//       .request(app)
//       .post('/api/unfollow/123') // Replace with the user id to unfollow
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('error');
//         done();
//         });
//         });
//         });
        
//         // Test suite for /api/profile
//         describe('/api/profile', () => {
//         it('should return the profile data of the authenticated user', (done) => {
//         chai
//         .request(app)
//         .get('/api/profile')
//         .set('Authorization', 'Bearer <jwt-token>') // Replace with a valid JWT token for authentication
//         .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('name');
//         expect(res.body).to.have.property('email');
//         expect(res.body).to.have.property('followers');
//         expect(res.body).to.have.property('following');
//         done();
//         });
//         });
        
//         it('should return an error for unauthorized access', (done) => {
//         chai
//         .request(app)
//         .get('/api/profile')
//         .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('error');
//         done();
//         });
//         });
//         });
        
//         // Test suite for /api/posts
//         describe('/api/posts', () => {
//         it('should return an array of posts', (done) => {
//         chai
//         .request(app)
//         .get('/api/posts')
//         .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');
//         done();
//         });
//         });
//         });
        
//         // Test suite for /api/posts/{id}
//         describe('/api/posts/{id}', () => {
//         it('should return a post with the given id', (done) => {
//         chai
//         .request(app)
//         .get('/api/posts/123') // Replace with the post id to fetch
//         .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('title');
//         expect(res.body).to.have.property('content');
//         done();
//         });
//         });
        
//         it('should return an error for invalid post id', (done) => {
//         chai
//         .request(app)
//         .get('/api/posts/999') // Replace with an invalid post id
//         .end((err, res) => {
//         expect(res).to.have.status(404);
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('error');
//         done();
//         });
//         });
//         });
        
        