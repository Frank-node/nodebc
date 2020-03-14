// Create a express server
const express = require('express');
const app = express();

//Serving static files in Express
app.use(express.static('public'))

//Set the pug template engine
app.set('view engine', 'pug');

//Set the mongoose to connect mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/superherodb');

//Setup the superhero schema, default collection name is superheros
const supheroSchema = new mongoose.Schema({
  name: String,
  image: String
}, { collection: 'superheroes' }); //Set a different name for your collection

const Superhero = mongoose.model("Superhero",supheroSchema);

// Superhero.create(
//   {
//     name: 'CAPTAIN MARVEL',
//     image: 'captainmarvel.jpg'
//   },
//   function(err, superhero){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Newly created superhero");
//       console.log(superhero);
//     }
//   });

// configure the port that expressis going to listen to
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
// const superheroes = [
//   { id: 1, name: 'SPIDER-MAN', image: 'spiderman.jpg' },
//   { id: 2, name: 'CAPTAIN MARVEL', image: 'captainmarvel.jpg' },
//   { id: 3, name: 'HULK', image: 'hulk.jpg' },
//   { id: 4, name: 'THOR', image: 'thor.jpg' },
//   { id: 5, name: 'IRON MAN', image: 'ironman.jpg' },
//   { id: 6, name: 'DAREDEVIL', image: 'daredevil.jpg' },
//   { id: 7, name: 'BLACK WIDOW', image: 'blackwidow.jpg' },
//   { id: 8, name: 'CAPTAIN AMERICA', image: 'captanamerica.jpg' },
//   { id: 9, name: 'WOLVERINE', image: 'wolverine.jpg' },
//   { id: 10, name: 'LUKE CAGE', image: 'lukecage.jpg' },
//   { id: 11, name: 'BATMAN', image: 'file-1583548086696Batman.jpg' },
//   { id: 12, name: 'ANT MAN', image: 'file-1583553186723Ant-Man.png' }
//];

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


//Set the router for home page
app.get('/', (req, res) => {
  //Get all superheroes from mongodb
  Superhero.find({},function(err, allSuperheroes){
    if(err){
      console.log(err);
    } else {
      res.render('index', { superheroes: allSuperheroes });
      console.log(allSuperheroes);
    }
  })
  //res.render('index', { superheroes: superheroes });
});


// app.get('/superheroes/', (req, res) => {
//   res.render('superhero', { superheroes: superheroes });
// });

app.get('/create', (req, res) => {
  res.render('create');
});

//the router for the detail of superhero page
app.get('/superheroes/:id', (req, res) => {
  // const selectedId = req.params.id;
  // //the usage of filter() method of Array
  // // let selectedSuperhero = superheroes.filter(superhero => {
  // //   //+selectedId: convert string to number, as Number(selectedId)
  // //   return superhero.id === +selectedId;
  // // });
  // //selectedSuperhero = selectedSuperhero[0]; 
  // //the usage find() method of Array 
  // let selectedSuperhero = superheroes.find( superhero => superhero.id === +selectedId );
  // console.log(selectedSuperhero);
  // res.render('superhero', { superhero: selectedSuperhero });

  Superhero.findById(req.params.id, function(err, foundSuperhero){
    if(err){
      console.log(err);
    } else {
      res.render('superhero', { superhero: foundSuperhero });
      console.log(foundSuperhero);
    }
  })
  
});

//Add body-parser as middleware
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//Create a new superhero
app.post('/superheros', upload.single('file'), (req, res) => {
  //const newId = superheroes[superheroes.length - 1].id + 1;
  console.log('body',req.body);
  console.log('file',req.file);
  const newSuperhero = {
    //id: newId, 
    name: req.body.superhero.toUpperCase(), 
    image: req.file.filename
  }
  Superhero.create(newSuperhero,   function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      console.log("Newly created superhero");
      res.redirect('/'); //redirect back to the homepage
      console.log(newlyCreated);
    }
  });
  
  //superheroes.push(newSuperhero);  
  //res.redirect('/');
});



