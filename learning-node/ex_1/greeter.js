const Logger = require('logplease');
const logger = Logger.create('utils');

const greet = (firstname, lastname, callBack) =>{
  console.log(`Hi ${firstname} ${lastname}`);
  if(typeof callBack != 'function'){
    logger.error('callBack is not a function');
    throw 'callBack is not a function';
  }
  else
    callBack();

}
const printMessage = () => {
  console.log('This code gets executed after the greet function call');
}

module.exports = { greet, printMessage};