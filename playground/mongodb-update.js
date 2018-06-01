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

  // findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate(
  // {
  //   _id: new ObjectID("5b10e94ab92424d257b16b36")
  // },
  // {
  //   $set:
  //   {
  //     completed: true
  //   }
  // },
  // {
  //   returnOriginal: false
  // }).then((result) =>
  // {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate(
  {
      _id: new ObjectID("5b10fd49b92424d257b16e29")
  },
  {
    $set:
    {
      name: "Joshua Manto"
    },
    $inc:
    {
      age: 1
    }
  },
  {
    returnOriginal: false
  }).then((result) =>
  {
    console.log(result);
  });


  //client.close();
});
