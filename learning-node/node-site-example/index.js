// Create a express server
const express = require('express');
const app = express();

//Serving static files in Express
app.use(express.static('public'))

//Set the pug template engine
app.set('view engine', 'pug');

// configure the port that express is going to listen to
const port = 3000;
app.listen(port, (err) => {  
  if (err) {
    return console.log(`Unable to start the server on port ${port}`, err);
  }
  console.log(`This HTTP server is running on port ${port}`);
});

// app.get('/', (req, res) => {
//   res.render('index', {});
// });
const superheroes = [
  { id: 1, name: 'SPIDER-MAN', image: 'spiderman.jpg' },
  { id: 2, name: 'CAPTAIN MARVEL', image: 'captainmarvel.jpg' },
  { id: 3, name: 'HULK', image: 'hulk.jpg' },
  { id: 4, name: 'THOR', image: 'thor.jpg' },
  { id: 5, name: 'IRON MAN', image: 'ironman.jpg' },
  { id: 6, name: 'DAREDEVIL', image: 'daredevil.jpg' },
  { id: 7, name: 'BLACK WIDOW', image: 'blackwidow.jpg' },
  { id: 8, name: 'CAPTAIN AMERICA', image: 'captanamerica.jpg' },
  { id: 9, name: 'WOLVERINE', image: 'wolverine.jpg' },
  { id: 10, name: 'LUKE CAGE', image: 'lukecage.jpg' },
];

//Use multer Module to handle the files uploaded
const multer  = require('multer');
//const upload = multer({ dest: 'upload' });
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/img/superheroes')
  },
  filename: function (req, file, cb) {
      //const extension = file.originalname.split('.').pop(); 
      console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + file.originalname);
  }
})
const upload = multer({ storage: storage });


//the router for home page
app.get('/', (req, res) => {
  res.render('index', { superheroes: superheroes });
});


// app.get('/superheroes/', (req, res) => {
//   res.render('superhero', { superheroes: superheroes });
// });

//the router for the detail of superhero page
app.get('/superheroes/:id', (req, res) => {
  const selectedId = req.params.id;

  let selectedSuperhero = superheroes.filter(superhero => {
    return superhero.id === +selectedId;
  });

  selectedSuperhero = selectedSuperhero[0];
  
  res.render('superhero', { superhero: selectedSuperhero });
});

//Add body-parser as middleware
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/superheros', upload.single('file'), (req, res) => {
  const newId = superheroes[superheroes.length - 1].id + 1;
  console.log('body',req.body);
  console.log('file',req.file);
  const newSuperHero = {
    id: newId, 
    name: req.body.superhero.toUpperCase(), 
    image: req.file.filename
  }
  
  superheroes.push(newSuperHero);
  
  res.redirect('/');
});



