const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// {
//   email: 'andrew@example.com',
//   password: 'myPass123'
//   tokens: [{
//     access: 'auth',
//     token: 'asdasdasdsadasdadas'
//   }]
// }

var UserSchema = new mongoose.Schema(
{
  email:
  {
    type: String,
    minlength: 1,
    trim: true,
    required: true,
    unique: true,
    valdidate:
    {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:
  {
    type: String,
    required: true,
    minlength: 6
  },
  // only available in mongodb
  tokens:[
  {
    access:
    {
      type: String,
      required: true
    },
    token:
    {
      type: String,
      required: true
    }
  }]
});

// override a method
UserSchema.methods.toJSON = function ()
{
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

// instance methods
UserSchema.methods.generateAuthToken = function ()
{
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() =>
  {
    return token;
  });
};

// Model method
UserSchema.statics.findByToken = function (token)
{
  var User = this;
  var decoded;

  try
  {
    decoded = jwt.verify(token, 'abc123');
  } catch (e)
  {
    // return new Promise((resolve, reject) =>
    // {
    //   reject();
    // });
    // same above and below (shortcut)
    return Promise.reject();
  }

  return User.findOne(
  {
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });


}

var User = mongoose.model('User', UserSchema);

module.exports = {User};

// example
// var newUser = new User(
// {
//   email: 'joshuamanto@yahoo.com'
// });
//
// newUser.save().then((doc) =>
// {
//   console.log('Saved user ', doc);
// }, (e) =>
// {
//   console.log('Unable to save user');
// });
