const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todosDummy = [
  { text: 'First to do'},
  { text: 'First to do 1'},
  { text: 'First to do 2'},
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todosDummy);
  }).then(() => done());
});

describe('App', () => {
    describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      const text = 'Test todo text';

      request(app)
        .post('/todos')
        .send({ text })
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end(async (err, res) => {
          if (err) {
            done(err);
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

    it('should not create todo with invalid data', (done) => {
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
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect(res => {
          expect(res.body.todos.length).toBe(3);
        })
        .end(done);
    });
  });
});