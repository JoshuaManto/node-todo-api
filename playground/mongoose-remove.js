const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')
// {todo} is es6 destructuring

// Todo.remove({}) - leave {} empty to delete all

// This will remove everything in Todo
// Todo.remove({}).then((result) =>
// {
//   console.log(result);
// });

// find first one found and get information back
//Todo.findOneAndRemove()

Todo.findOneAndRemove({_id}).then((todo) =>
{
  console.log(todo);
});

// Todo.findByIdAndRemove

Todo.findByIdAndRemove('5b124faab92424d257b184e6').then((todo) =>
{
  console.log(todo);
});
