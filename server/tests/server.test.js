const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () =>
{
  it('should create a new todo', (done) =>
  {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) =>
      {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) =>
      {
        if(err)
        {
          return done(err);
        }
        Todo.find({text}).then((todos)=>
        {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) =>
  {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) =>
      {
        if(err)
        {
          return done(err);
        }
        Todo.find().then((todos)=>
        {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () =>
{
  it('should get all todos', (done) =>
  {
    request(app)
      .set('x-auth', users[0].tokens[0].token)
      .get('/todos')
      .expect(200)
      .expect((res) =>
      {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/.id', () =>
{
  it('should return todo doc', (done) =>
  {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>
      {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by another user', (done) =>
  {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) =>
      .end(done);
  });

  it('should return 404 if todo not found', (done) =>
  {
    // make sure you get a 404 back
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      // .expect((res) =>
      // {
      //   expect(res.body.todo.id).
      // });
      .end(done);
  });

  it('should return 404 for non-object ids', (done) =>
  {
    // /todos/123
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  })
});

describe('DELETE /todos/:id', () =>
{
  it('should remove a todo', (done) =>
  {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) =>
      {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) =>
      {
        if(err)
        {
          return done(err);
        }

        // query database using findById toNotExist
        // expect(null).toNotExist();
        Todo.findById(hexId).then((todo) =>
        {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove a todo owned by another user', (done) =>
  {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect((res) =>
      .end((err, res) =>
      {
        if(err)
        {
          return done(err);
        }

        // query database using findById toNotExist
        // expect(null).toNotExist();
        Todo.findById(hexId).then((todo) =>
        {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) =>
  {
    var hexId = new ObjectID().toHexString();
    // make sure you get a 404 back
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      // .expect((res) =>
      // {
      //   expect(res.body.todo.id).
      // });
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) =>
  {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);

  });
});

describe('PATCH /todos/:id', () =>
{
  it('should update the todo', (done) =>
  {
    // grab id of first item
    var hexId = todos[0]._id.toHexString();
    var text = 'Da new text this be';
    // update text, set completed true
    // auth as first user
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(
        {
            text,
            completed: true
        })
      .expect(200)
      .expect((res) =>
      {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

      // (err, res) =>
      // {
      //   if(err)
      //   {
      //     return done(err);
      //   }
      //
      //   Todo.findById(hexId).then((todo) =>
      //   {
      //     expect(todos[0].text).toBe(text);
      //     expect(todos[0].completed).toBe(true);
      //     expect(todos[0].completedAt).toBeA('number');
      //     done();
      //   }).catch((e) => done(e));
      // });
    // 200
    // text is changed, completed is true, completedAt is a number .toBeA()


  });
  // try to update first todo as 2nd user. should get 404 back in assert
  it('should update the todo', (done) =>
  {
    // grab id of first item
    var hexId = todos[0]._id.toHexString();
    var text = 'Da new text this be';
    // update text, set completed true
    // auth as first user
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(
        {
            text,
            completed: true
        })
      .expect(404)
      .expect((res) =>
      .end(done);

      // (err, res) =>
      // {
      //   if(err)
      //   {
      //     return done(err);
      //   }
      //
      //   Todo.findById(hexId).then((todo) =>
      //   {
      //     expect(todos[0].text).toBe(text);
      //     expect(todos[0].completed).toBe(true);
      //     expect(todos[0].completedAt).toBeA('number');
      //     done();
      //   }).catch((e) => done(e));
      // });
    // 200
    // text is changed, completed is true, completedAt is a number .toBeA()


  });

  it('should clear completedAt when todo is not completed', (done) =>
  {
    // grab id of second to do item
    var hexId = todos[1]._id.toHexString();
    var text = "Da new text this be 2222";
    // update text of something different, set completed to false
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(
        {
            text,
            completed: false,
        })
      .expect(200)
      .expect((res) =>
      {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

      // (err, res) =>
      // {
      //   if(err)
      //   {
      //     return done(err);
      //   }
      //
      //   Todo.findById(hexId).then((todo) =>
      //   {
      //     expect(todos[0].text).toBe(text);
      //     expect(todos[0].completed).toBe(true);
      //     expect(todos[0].completedAt).toNotExist();
      //     done();
      //   }).catch((e) => done(e));
      // });
    // 200
    // text is changed, completed is now false and completedAt is null .toNotExist


  });


});
