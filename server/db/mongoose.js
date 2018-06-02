const mongoose = require('mongoose');

// use local javascript promise than 3rd party promise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Todo');


module.exports =
{
  mongoose
}
