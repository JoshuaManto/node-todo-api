const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// takes data with user id and it signs it. creates hash and returns token value
jwt.sign
// takes token and secret and makes sure data was not manipulated
jwt.verify

var data =
{
  id: 10,
  text: 'yo sup bruh',
  password: 'kaka'
};
// object and secret
var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);



// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data =
// {
//   id: 4
// };
// var token =
// {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // Man in the middle example, but they dont have the salt so the hash wont be the same
// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash)
// {
//   console.log('Data was not changed');
// }
// else
// {
//   console.log('Data was changed dont trust!!!');
// }
