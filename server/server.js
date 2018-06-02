const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

// URL and callback
app.post('/todos', (req, res) =>
{
  var todo = new Todo(
  {
    text: req.body.text
  });

  todo.save().then((doc) =>
  {
    // this will give back id and completed and completedAt properties
    res.send(doc);
  }, (e) =>
  {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) =>
{
  Todo.find().then((todos) =>
  {
    res.send(
      {
        todos
      });
  }, (e) =>
  {
    res.status(400).send(e);
  });
});

// GET /todos/1234
app.get('/todos/:id', (req, res) =>
{
  //res.send(req.params);
  var id = req.params.id;

  // validate id using isValid
    // 404 if invalid = send back empty Second
  if(!ObjectID.isValid(id))
  {
    return res.status(404).send();
  }

  // findById
    // success
      // if todo - send it back
      // if no todo - send back 404 with empty body
    // error
      // 400 request not valid - send empty body back
    Todo.findById(id).then((todo) =>
    {
      if(!todo)
      {
        return res.status(404).send();
      }
      // put in {} object for more flexibility in the future
      res.send({todo});
    }, (e) =>
    {
      res.status(400).send();
    });
});

app.listen(3000, () =>
{
  console.log('Started on port 3000');
});

module.exports = {app};
