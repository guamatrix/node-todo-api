const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todosDummy, populateTodos, usersDummy, populateUser } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUser);

describe('App', () => {
  describe('POST /todos', () => {
    it('should create a new todo', done => {
      const text = 'Test todo text';

      request(app)
        .post('/todos')
        .set('x-auth', usersDummy[0].tokens[0].token)
        .send({ text })
        .expect(200)
        .expect(res => {
          expect(res.body.text).toBe(text);
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const todos = await Todo.find({ text });
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should not create todo with invalid data', done => {
      request(app)
        .post('/todos')
        .set('x-auth', usersDummy[0].tokens[0].token)
        .send({})
        .expect(400)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const todos = await Todo.find();
            expect(todos.length).toBe(3);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should fail when set not header token', done => {
      request(app)
        .post('/todos')
        .send({ text: 'test' })
        .expect(401)
        .end(done);
    });
  });

  describe('GET /todos', () => {
    it('should get todos', done => {
      request(app)
        .get('/todos')
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });

    it('should fail when not set header token', done => {
      request(app)
        .get('/todos')
        .expect(401)
        .end(done);
    });
  });

  describe('GET /todos/id', () => {
    it('should get todo by id', done => {
      const id = todosDummy[1]._id.toHexString();
      request(app)
        .get(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body.todo._id).toBe(id);
        })
        .end(done);
    });

    it('should return 404 with invalid id', done => {
      const id = '1asdsa45';
      request(app)
        .get(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not exist', done => {
      const id = new ObjectID();
      request(app)
        .get(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should fail when not set header token', done => {
      const id = todosDummy[0]._id;
      request(app)
        .get(`/todos/${id}`)
        .expect(401)
        .end(done);
    });
  });

  describe('DELETE /todos/id', () => {
    it('should return removed todo', done => {
      const id = todosDummy[0]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body.todo._id).toBe(id);
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const todos = await Todo.findById(id);
            expect(todos).toBeFalsy();
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should not delete a todo not created by user', done => {
      const id = todosDummy[2]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const todos = await Todo.findById(id);
            expect(todos).toBeTruthy();
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should return 404 with invalid id', done => {
      const id = '1asdsa45';
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not exist', done => {
      const id = new ObjectID();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should fail when not set header token', done => {
      const id = todosDummy[0]._id;
      request(app)
        .delete(`/todos/${id}`)
        .expect(401)
        .end(done);
    });
  });

  describe('PATCH /todo/:id', () => {
    it('should update todo completed', done => {
      const id = todosDummy[0]._id.toHexString();
      const body = { text: 'something', completed: true };
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body.todo.text).toBe(body.text);
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const todoUpdated = await Todo.findById(id);
            expect(todoUpdated.text).toBe(body.text);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should update todo to not completed', done => {
      const id = todosDummy[0]._id.toHexString();
      const body = { completed: false };
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body.todo.completed).toBe(body.completed);
          expect(res.body.todo.completedAt).toBe(null);
        })
        .end(async (err, res) => {
          if (err) {
            done(err);
          }
          try {
            const todoUpdated = await Todo.findById(id);
            expect(todoUpdated.completedAt).toBe(null);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should return 404 when update with invalid id', done => {
      const id = '1asdsa45';
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 when try to update todo that not exist', done => {
      const id = new ObjectID();
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should fail when not set header token', done => {
      const id = todosDummy[0]._id;
      request(app)
        .patch(`/todos/${id}`)
        .expect(401)
        .end(done);
    });

    it('should not update a todo not created by user', done => {
      const id = todosDummy[2]._id.toHexString();
      const body = { completed: true };
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', usersDummy[0].tokens[0].token)
        .send(body)
        .expect(404)
        .expect(res => {
          expect(res.body).toEqual({});
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const todoUpdated = await Todo.findById(id);
            expect(todoUpdated.completed).toBe(false);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
      request(app)
        .get('/users/me')
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(usersDummy[0]._id.toHexString());
          expect(res.body.email).toBe(usersDummy[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', done => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect(res => {
          expect(res.body['errors']).toBeTruthy();
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create a user', done => {
      const email = 'prueba@prueba.com';
      const password = '123456789';
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(200)
        .expect(res => {
          expect(res.body.user.email).toBe(email);
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body.user._id).toBeTruthy();
        })
        .end(async err => {
          if (err) {
            return done(err);
          }
          try {
            const user = await User.findOne({ email });
            expect(user.email).toBe(email);
            expect(user.password).not.toBe(password);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should return validation error if request invalid', done => {
      const email = 'bad email';
      const password = '123';
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body['errors']).toBeTruthy();
        })
        .end(async err => {
          if (err) {
            return done(err);
          }
          try {
            const user = await User.findOne({ email });
            expect(user).toBe(null);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('sould not create user if email in use', done => {
      const email = usersDummy[0].email;
      const password = '123456';
      request(app)
        .post('/users')
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body['errors']).toBeTruthy();
        })
        .end(async err => {
          if (err) {
            return done(err);
          }
          try {
            const user = await User.find({ email });
            expect(user.length).toBe(1);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('POST /users/login', () => {
    it('should login user and return token', done => {
      const { email, password } = usersDummy[1];
      request(app)
        .post('/users/login')
        .send({ email, password })
        .expect(200)
        .expect(res => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body.user.email).toBe(email);
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const user = await User.findById(usersDummy[1]._id);
            // @ts-ignore
            expect(user.tokens[0]).toHaveProperty(['token'], res.headers['x-auth']);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should reject invalid login', done => {
      const email = 'cada@cada.com';
      const password = 'casapasdfgf';
      request(app)
        .post('/users/login')
        .send({ email, password })
        .expect(400)
        .expect(res => {
          expect(res.body['errors']).toBeTruthy();
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const user = await User.findById(usersDummy[1]._id);
            // @ts-ignore
            expect(user.tokens.length).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('DELETE /users/me/token', () => {
    it('should delete token', done => {
      request(app)
        .delete('/users/me/token')
        .set('x-auth', usersDummy[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body).toEqual({});
          expect(res.headers['x-auth']).toBeFalsy();
        })
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          try {
            const user = await User.find({
              tokens: { token: usersDummy[0].tokens[0].token }
            });
            expect(user.length).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should return 400 deleting token with invalid token', done => {
      const tokenDummy = 'nsdd6sbsdjsdodody';
      request(app)
        .delete('/users/me/token')
        .set('x-auth', tokenDummy)
        .expect(401)
        .end(done);
    });
  });
});
