const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens:[
  {
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},
{
  _id: userTwoId,
  email: 'gem@example.com',
  password: 'userTwoPass',
  tokens:[
  {
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}];

const todos = [
{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
},
{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateTodos = (done) =>
{
  // wipe all todos
  Todo.remove({}).then(() =>
  {
    // should put return but it works without return and bug with return
    Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) =>
{
  User.remove({}).then(() =>
  {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    // also not working. fuck this shit
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};