const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// URL and callback
// ADD POST
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

// GET ALL TODOS
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
// GET TODOS BY ID
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

// DELETE TODOS BY ID

app.delete('/todos/:id', (req, res) =>
{
  // get the id
  var id = req.params.id;

  // validate the id - not valid return 404
  if(!ObjectID.isValid(id))
  {
    return res.status(404).send();
  }

  // remove todo by id
    // success
      // if no doc, send 404
      // if doc, send doc back with 200
    // error
      // 400 send back empty body
    Todo.findByIdAndRemove(id).then((todo) =>
    {
      if(!todo)
      {
        return res.status(404).send();
      }
      res.status(200).send({todo});
    }, (e) =>
    {
      res.status(400).send();
    });

});

// UPDATE TODOs
app.patch('/todos/:id', (req, res) =>
{
  var id = req.params.id;
  // Got subset of things user passed to us and we dont want the user to update anything they choose
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id))
  {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed)
  {
    body.completedAt = new Date().getTime();
  }
  else
  {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set : body}, {new: true}).then((todo) =>
  {
    if(! todo)
    {
      return res.status(404).send();
    }
    // success
    res.send({todo})
  }).catch((e) =>
  {
    res.status(400).send();
  })
})


app.listen(port, () =>
{
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
