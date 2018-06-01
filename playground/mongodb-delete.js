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

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) =>
  // {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'study'}).then((result) =>
  // {
  //   console.log(result);
  // });

  // fundOneAndDelete
  // delete the documents and get the object back so you can tell the user which one deleted
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) =>
  // {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Joshua Manto'}).then((result) =>
  // {
  //   console.log('Success');
  // });
  db.collection('Users').findOneAndDelete({_id: new ObjectID("5b10e0d9c0ccd529bcc09cb2")}).then((result) =>
  {
    console.log(JSON.stringify(result, undefined, 2));
  });


  //client.close();
});
