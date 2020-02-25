console.log('Running my first script!!');
//const express = require('express');
//console.log(express);

const Logger = require('logplease');
const logger = Logger.create('utils');
logger.debug(`Hello Node.js`);
logger.log(`Hello Node.js`); // alias for debug()
logger.info(`Node.js is great!!`);
logger.warn(`Warning, Warning, I think we have a Warning`);
logger.error(`Mayday Mayday, we have an errro, repeat.. we have an error`);

var oneLinerJoke = require('one-liner-joke');

/*
The variable getRandomJoke will contain a random joke with a format:
{"body":"Artificial intelligence is no match for natural stupidity.","tags":["intelligence","stupid"]}
*/
var getRandomJoke = oneLinerJoke.getRandomJoke();
console.log(getRandomJoke.body);
console.log(getRandomJoke.tags); 

const isEven = require('./number');

const numArray = [2, 3, 101, 201, 202, 100];
numArray.forEach(
    item => {
        if (isEven(item))
            logger.info(`Number ${item} is even.`);
        else
            logger.error(`Number ${item} is odd.`);
    }
);

const callBack = () => {
    console.log('This code gets executed after the greet function call');
}
const greet = (firstname, lastname, callBack) =>{
    console.log(`Hi ${firstname} ${lastname}`);
    callBack();

}

greet('Frank','Gu',callBack);


