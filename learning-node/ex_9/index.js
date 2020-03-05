// require the express module
const express = require('express');
const port = 3000;
const Logger = require('logplease');
const logger = Logger.create('utils');
const path = require('path');

// then create a express server
const app = express();

// configure the port that express is going to listen to
app.listen(port, (err) => {  
  if (err) {
    //return console.log(`Unable to start the server on port ${port}`, err);
    return logger.error(`Unable to start the server on port ${port}`, err);
  }

  //console.log(`This HTTP server is running on port ${port}`);
  logger.info(`This HTTP server is running on port ${port}`)
});

// configure the default route and send a text as response
//GET /: show a welcome message
app.get('/', function(request, response) {
  //response.send('<h2>Congrats you\'re using your first Node.js and Express as Web Server</h2>');
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', function(request, response) {
  response.sendFile(path.join(__dirname, 'products.html'));
});

//GET jokes: show at least 2 jokes
app.get('/jokes', function(req, res) {
  res.send('<h2>show at least 2 jokes</h2>');
});

//To get the id from the url we use req.params.id
app.get('/products/:id', (req, res) => {
  const id = req.params.id;

  res.send(`Product with the id: ${id}`);
});

//Using an url like http://localhost:3000/products/?id=1 we are passing id=1 as query string
//The request object has a query property that allows us to get the URL query string params
app.get('/product', (req, res) => {
  const id = req.query.id;
  
  res.send(`Product with the id: ${id}`);
});

//As the form is configured to use GET it will send all this values using query string
//The URL it's going to look like: http://localhost:3000/products?username=nisnardi&firstname=nicolas&lastname=isnardi
//Configure the route to handle these values
app.get('/getuser', (req, res) => {
  const username = req.query.username;
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const bioContent =req.query.bio;  
  
  res.send(`We got the following values from the query string: 
  Username: ${username}, Firstname: ${firstname} , Lastname: ${lastname},
  Bio: ${bioContent}`);
});

//To send data to the server using POST we can change  the form action by setting methond="post"
//Now the values won't be submitted as query string and instead we'll send them on the request bodyTo use Express to get POST values we need to add body-parser that's a Express middleware
//Body parser can get all the POST requests or we can configure it just fo the routes that we want
//Then it will get the POST values and append then as request body property
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/postuser', urlencodedParser, (req, res) => {
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const bioContent =req.body.bio;  
  
  console.log(req.body);
  
  res.send(`We got the following values from the query string: 
  Username: ${username}, Firstname: ${firstname} , Lastname: ${lastname},
  Bio: ${bioContent}`);
  //res.send(`We got the following values from the query string: ${username}, ${firstname} & ${lastname}`);
  //res.send(req.body);
});

//Use multer Module to handle the files uploaded
const multer  = require('multer');
const upload = multer({ dest: 'upload' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filename = req.file.originalname;
  
  console.log(req.body);
  console.log(req.file);
  
  res.send(`Congrats we uploaded the following file ${filename}`);
});

//GET joke: show 1 jokes
app.get('/joke', function(req, res) {
  //res.send('<h2>show 1 jokes</h2>');
  res.json({ name: 'Marta', age: '40'});
});

//GET /api/products: get products JSON object
app.get('/api/products', function(req, res) {
  //res.send('<h2>show 1 jokes</h2>');
  res.json({
    description: 'Products',
    items: [
      { name: 'Star Wars jacket' , price: 100},
      { name: 'FIFA 22 PS4' , price: 79},
      { name: 'Superheore t-shirt' , price: 10},
      { name: 'Jets game shirt' , price: 200},
      { name: 'Large Meat lovers pizza' , price: 12},
      { name: 'Canada Dry  bottle' , price: 2}
    ]
  });
});


//POST joke: my jokes are too funny, I'm not getting new ones from you..
app.post('/joke', function(req, res) {
  res.send('my jokes are too funny, I\'m not getting new ones from you..');
  
});

//PUT joke: no, no, no.. not changing my act dude!
app.put('/joke', function(req, res) {
  res.send('no, no, no.. not changing my act dude!');
});

//DELETE: joke: good jokes never get to old
app.delete('/joke', function(req, res) {
  res.send('good jokes never get to old');
});

//All: joke: I know I'm so good that you're looking for jokes everywhere
app.all('/', function(req, res) {
  res.send('I know I\'m so good that you\'re looking for jokes everywhere');
}); 




