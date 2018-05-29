const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todosDummy = [
  { text: 'First to do', _id: new ObjectID(), completed: false },
  { text: 'First to do 1', _id: new ObjectID(), completed: false },
  { text: 'First to do 2', _id: new ObjectID(), completed: false }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todosDummy);
    })
    .then(() => done());
});

describe('App', () => {
  describe('POST /todos', () => {
    it('should create a new todo', done => {
      const text = 'Test todo text';

      request(app)
        .post('/todos')
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
  });

  describe('GET /todos', () => {
    it('should get all todos', done => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect(res => {
          expect(res.body.todos.length).toBe(3);
        })
        .end(done);
    });
  });

  describe('GET /todos/id', () => {
    it('should get todo by id', done => {
      const id = todosDummy[1]._id.toHexString();
      request(app)
        .get(`/todos/${id}`)
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
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not exist', done => {
      const id = new ObjectID();
      request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /todos/id', () => {
    it('should return removed todo', done => {
      const id = todosDummy[0]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
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

    it('should return 404 with invalid id', done => {
      const id = '1asdsa45';
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not exist', done => {
      const id = new ObjectID();
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todo/:id', () => {
    it('should update todo completed', done => {
      const id = todosDummy[1]._id.toHexString();
      const body = { text: 'something', completed: true };
      request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .expect((res) => {
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
            done(error)
          }
        });

    });

    it('should update todo to not completed', done => {
      const id = todosDummy[0]._id.toHexString();
      const body = { completed: false };
      request(app)
        .patch(`/todos/${id}`)
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
        })
    });

    it('should return 404 when update with invalid id', done => {
      const id = '1asdsa45';
      request(app)
        .patch(`/todos/${id}`)
        .expect(404)
        .end(done);      
    });

    it('should return 404 when try to update todo that not exist', done => {
      const id = new ObjectID();
      request(app)
        .patch(`/todos/${id}`)
        .expect(404)
        .end(done);      
    });
  });
});
