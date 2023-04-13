const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect
const jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MTM4MzM1OSwiZXhwIjoxNjgxNDI2NTU5fQ.HBWPRX2RvQ8yMsZT_Y-fa2TvAeihtlJVuC9hi60rTDI'
const unauth_token = 'ss13'

chai.use(chaiHttp)

// Test suite for /api/authenticate
describe('/api/authenticate', () => {
  it('should return a JWT token on successful authentication', (done) => {
    chai
      .request(app)
      .post('/api/authenticate')
      .send({ email: 'shobham.rajak@gmail.com', password: 'password' }) // Replace with dummy email and password
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('token')
        done()
      })
  })

  it('should return an error for invalid credentials', (done) => {
    chai
      .request(app)
      .post('/api/authenticate')
      .send({ email: 'shobham.rajak@gmail.com', password: 'wrongpassword' }) // Replace with dummy email and wrong password
      .end((err, res) => {
        expect(res).to.have.status(401)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        done()
      })
  })
})

// Test suite for /api/profile
describe('/api/user', () => {
    it('should return the profile data of the authenticated user', (done) => {
        chai
            .request(app)
            .get('/api/user')
            .send({ user: {id:'1'}})
            .set('Authorization', `Bearer ${jwt_token}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('user')
                done()
            })
    })
    it('should return an error for unauthorized access', (done) => {
        chai
            .request(app)
            .get('/api/user')
            .send({ user: {id:'1'}})
            .set('Authorization', `Bearer ${unauth_token}`)
            .end((err, res) => {
                expect(res).to.have.status(401)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('error')
                done()
            })
    })
})

// Test suite for /api/follow/{id}
describe('/api/follow/{id}', () => {
  it('should follow a user with the given id', (done) => {
    chai
        .request(app)
        .post('/api/follow/2')
        .send({ user: {id:'1'}})
        .set('Authorization', `Bearer ${jwt_token}`)
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('message')
            done()
        })
  })
  it('should return an error since follower id is not present in database', (done) => {
    chai
        .request(app)
        .post('/api/follow/3')
        .send({ user: {id:'1'}})
        .set('Authorization', `Bearer ${jwt_token}`)
        .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('error')
            done()
        })
  })
})

// Test suite for /api/unfollow/{id}
describe('/api/unfollow/{id}', () => {
  it('should unfollow a user with the given id', (done) => {
    chai
        .request(app)
        .post('/api/unfollow/2')
        .send({ user: {id:'1'}})
        .set('Authorization', `Bearer ${jwt_token}`)
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('message')
            done()
        })
  })
  it('should return an error since follower id is not present in the database', (done) => {
      chai
          .request(app)
          .post('/api/unfollow/123')
          .send({ user: {id:'1'}})
          .set('Authorization', `Bearer ${jwt_token}`)
          .end((err, res) => {
              expect(res).to.have.status(400)
              expect(res.body).to.be.an('object')
              expect(res.body).to.have.property('error')
              done()
          })
  })
})

// Test suite for /api/posts/{id}
describe('/api/posts/{id}', () => {
    it('should return a post with the given id', (done) => {
        chai
            .request(app)
            .get('/api/posts/1')
            .set('Authorization', `Bearer ${jwt_token}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('description')
                expect(res.body).to.have.property('created_at')
                expect(res.body).to.have.property('likes_count')
                expect(res.body).to.have.property('comments')
                done()
            })
    })
    it('should return an error for invalid post id', (done) => {
        chai
            .request(app)
            .get('/api/posts/123')
            .set('Authorization', `Bearer ${jwt_token}`)
            .end((err, res) => {
                expect(res).to.have.status(404)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('error')
                done()
            })
    })
})

describe('/api/comment/{id}', () => {
    it('should return a comment_id for a post', (done) => {
        chai
            .request(app)
            .post('/api/comment/1')
            .send({ user: {id:'1', comment: 'WOW!'}})
            .set('Authorization', `Bearer ${jwt_token}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('commentId')
                done()
            })
    })
    it('should return a comment_id for a post', (done) => {
        chai
            .request(app)
            .post('/api/comment/1')
            .send({ user: {id:'1', comment: 'WOW!'}})
            .set('Authorization', `Bearer ${unauth_token}`)
            .end((err, res) => {
                expect(res).to.have.status(401)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('error')
                done()
            })
    })
})

// Test suite for /api/all_posts
describe('/api/all_posts', () => {
    it('should return an array of posts', (done) => {
        chai
            .request(app)
            .get('/api/all_posts')
            .send({ user: {id:'1'}})
            .set('Authorization', `Bearer ${jwt_token}`)
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')
                done()
            })
    })
    it('should return an error for unauthorized access', (done) => {
        chai
            .request(app)
            .get('/api/all_posts')
            .send({ user: {id:'1'}})
            .set('Authorization', `Bearer ${unauth_token}`)
            .end((err, res) => {
                expect(res).to.have.status(401)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('error')
                done()
            })
    })
})

        