const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')
// {todo} is es6 destructuring

// var id = '5b122da1df330028f8f698c311';
//
// if(!ObjectID.isValid(id))
// {
//   console.log('ID not valid');
// }
var userId = '5b110d31283e690a8c3ea857';

// Todo.find(
// {
//   _id: id
// }).then((todos) =>
// {
//   console.log('Todos', todos);
// });
//
// Todo.findOne(
// {
//   _id: id
// }).then((todo) =>
// {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) =>
// {
//   if(!todo)
//   {
//     return console.log('Todo Id not found');
//   }
//   console.log('Todo find by id', todo);
// }).catch((e) => console.log(e));

// User.findById
// handle case where user not found and user found
// handle error
User.findById(userId).then((user) =>
{
  if(!user)
  {
    return console.log('User id not found');
  }
  console.log('User find by id', user);
}).catch((e) => console.log(e));
