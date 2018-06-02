const express = require('express');
const bodyParser = require('body-parser');

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
  })
});

app.listen(3000, () =>
{
  console.log('Started on port 3000');
});

module.exports = {app};
