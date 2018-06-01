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

  // db.collection('Todos').find(
  // {
  //   //_id: new ObjectID("5b10e94ab92424d257b16b36")
  // }).toArray().then((docs) =>
  // {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) =>
  // {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) =>
  // {
  //   console.log(`Todos ${count}`);
  // }, (err) =>
  // {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find(
  {
    name: 'Joshua Manto'
  }).toArray().then((docs) =>
  {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) =>
  {
    console.log('Unable to fetch todos', err);
  });


  //client.close();
});
