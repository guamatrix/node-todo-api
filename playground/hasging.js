const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const message = 'I am user number 3';

const hash = SHA256(message).toString();

console.log(hash);

let data = {
  id: 234
};

const token = jwt.sign(data, '123abc');
console.log(token);

const decoded = jwt.verify(token, '123abc');
console.log(decoded);