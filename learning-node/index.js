/* console.log('Welcome to JavaScript and Node.js server side');
var person = {
  name: "John Rambo",
  age: 33,
  address: "170 Richards st"
};

console.log(person.name);
console.log(person.age);
console.log(person.address); */

//Express example: Hello World
const getPrice = require('./my-module');

const price = getPrice(200);

console.log(price);


const express = require('express');
console.log(express);
var oneLinerJoke = require('one-liner-joke');

/*
The variable getRandomJoke will contain a random joke with a format:
{"body":"Artificial intelligence is no match for natural stupidity.","tags":["intelligence","stupid"]}
*/
var getRandomJoke = oneLinerJoke.getRandomJoke();
console.log(getRandomJoke.body);
console.log(getRandomJoke.tags);

const app = express();
 
app.get('/', function (req, res) {
  res.send('<h1>Hello World</h1>')
});
 
app.listen(3000);

