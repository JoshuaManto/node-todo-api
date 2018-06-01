// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
// Object destructuring - lets pull out properties from object creating variables
// var user = {name: 'Andrew', age: 25};
// var {name} = user;
// console.log(name);
// var obj = new ObjectID();
// console.log(obj);

// 2 arguments - string (url where database lives. can ne aws or heroku or localhost or others), and a callback function
MongoClient.connect('mongodb://localhost:27017/TodoApp',     (err, client) =>
{
  if(err)
  {
    return console.log('Unable to connect to MongoDB Server');
  }
  console.log('Connected to MongoDB Server');
  const db = client.db('TodoApp');

  // string name of collection as only argument
  // 2 arguments - object and callback
  // db.collection('Todos').insertOne(
  // {
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) =>
  // {
  //   if(err)
  //   {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   // ops store all of the docs that was instered
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // insert new doc into Users (name , age, location)
  // db.collection('Users').insertOne(
  // {
  //   name: 'Joshua Manto',
  //   age: 22,
  //   location: 'Philippines'
  // }, (err, result) =>
  // {
  //   if(err)
  //   {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   // ops store all of the docs that was instered
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });


  client.close();
});
