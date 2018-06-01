const mongoose = require('mongoose');

var User = mongoose.model('User',
{
  email:
  {
    type: String,
    minlength: 1,
    trim: true
  }
});

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
