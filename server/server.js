require('./config/config')
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// URL and callback
// ADD POST
app.post('/todos', authenticate, (req, res) =>
{
  var todo = new Todo(
  {
    text: req.body.text,
    _creator: req.user._id
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
app.get('/todos', authenticate, (req, res) =>
{
  Todo.find(
  {
    _creator: req.user._id
  }).then((todos) =>
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
app.get('/todos/:id', authenticate, (req, res) =>
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
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) =>
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

app.delete('/todos/:id', authenticate, (req, res) =>
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
    Todo.findOneAndRemove(
    {
      _id: id,
      _creator: req.user._id
    }).then((todo) =>
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
app.patch('/todos/:id', authenticate, (req, res) =>
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

  Todo.findOneAndUpdate(
  {
    _id: id,
    _creator: req.user._id
  },
    {$set : body},
    {new: true}
  ).then((todo) =>
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

// POST /users
// _.pick email and password
app.post('/users', (req, res) =>
{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  // User // model method
  // User.findByToken
  //
  // user // instance method
  // user.generateAuthToken


  user.save().then(() =>
  {
    return user.generateAuthToken();
    //res.send(user);
  }).then((token) =>
  {
    res.header('x-auth', token).send(user);
  }).catch((e) =>
  {
    res.status(400).send(e);
  });
});


// private route
app.get('/users/me', authenticate, (req, res) =>
{
  // var token = req.header('x-auth');
  //
  // User.findByToken(token).then((user) =>
  // {
  //   if(!user)
  //   {
  //     return Promise.reject();
  //   }
  //
  //   res.send(user);
  // }).catch((e) =>
  // {
  //   res.status(401).send();
  // });

  res.send(req.user);
});

// POST / users/login (email, password)
app.post('/users/login', (req, res) =>
{
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) =>
  {
    return user.generateAuthToken().then((token) =>
    {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) =>
  {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) =>
{
  req.user.removeToken(req.token).then(() =>
  {
    res.status(200).send();
  }, () =>
  {
    res.status(400).send();
  });
});


app.listen(port, () =>
{
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
