// Create a express server
const express = require('express');
const app = express();

//Require the data model
const Superhero = require('./models/superhero');
const Comment = require('./models/comment');
const User = require('./models/user');

//Add body-parser as middleware
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

//PASSPORT CONFIGURATION
const passport    = require("passport");
const LocalStrategy = require("passport-local");
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});




//Serving static files in Express
app.use(express.static('public'));


//Set the pug template engine
app.set('view engine', 'pug');

//Set the mongoose to connect mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/superherodb');
//mongoose.connect('mongodb+srv://nodetest:dbTestbc@cluster0-3osxf.mongodb.net/superherodb?retryWrites=true&w=majority');


//Setup the superhero schema, default collection name is superheros
// const supheroSchema = new mongoose.Schema({
//   name: String,
//   image: String
// }, { collection: 'superheroes' }); //Set a different name for your collection

// const Superhero = mongoose.model("Superhero",supheroSchema);

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

// use port 3000 unless there exists a preconfigured port
const port = process.env.PORT || 3000;

// configure the port that expressis going to listen to

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

//Set the route for home page
app.get("/", function(req, res){
  res.render("landing");
});

//Set the router for the list of superheroes page
app.get('/superheroes', (req, res) => {
  //Get all superheroes from mongodb
  Superhero.find({},function(err, allSuperheroes){
    if(err){
      console.log(err);
    } else {
      allSuperheroes.reverse();
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

  Superhero.findById(req.params.id).populate("comments").exec(function(err, foundSuperhero){
    if(err){
      console.log(err);
    } else {
      res.render('superhero', { superhero: foundSuperhero });
      console.log(foundSuperhero);
    }
  })
  
});

//Include File System module
const fs = require('fs');

//Set the route to delete a superhero 
app.get('/delete/:id', (req, res) => {
    Superhero.findByIdAndRemove(req.params.id, function(err, deletedSuperhero){
    if(err){
      res.redirect('/'); 
    } else {
      
      console.log(deletedSuperhero);
      const deletedFilename = __dirname + "/public/img/superheroes/"+ deletedSuperhero.image;
      console.log(deletedFilename);
      //fs.unlinkSync(deletedFilename);  // delete file synchronously
      
      // delete file asynchronously
      if(fs.existsSync(deletedFilename)){
        fs.unlink(deletedFilename, (err) => {
          if (err) throw err;
          console.log('successfully deleted images from folder superheroes');
        });
      }
      res.redirect('/'); 
    } 
  })
  
});

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

//update view
app.get('/update/:id', (req, res) => {
  //internal scope of this function
  // MongoClient.connect(url, function (err, client) {
  //     const db = client.db('comics');
  //     const collection = db.collection('superheroes');
  //     const selectedId = req.params.id;

  //     collection.find({ "_id": ObjectID(selectedId) }).toArray((error, documents) => {
  //         client.close();
  //         res.render('update', { superheroe: documents[0] });
  //     });
  // });

  Superhero.findById(req.params.id, function(err, foundSuperhero){
    if(err){
      console.log(err);
    } else {
      res.render('update', { superhero: foundSuperhero });
      console.log(foundSuperhero);
    }
  })

});

//Update method for superhero
app.post('/superheroUpdate/:id', upload.single('file'), (req, res) => {

  const newSuperhero = {
    name: req.body.superhero.toUpperCase(), 
    image: req.file.filename
  }

  if (req.file){
      console.log("Updating image");
      newSuperhero.image = req.file.filename;
  }

  Superhero.findByIdAndUpdate(req.params.id, {$set: newSuperhero}, function(err, originalSuperhero){
    if(err){
      res.redirect('/'); 
    } else {
      
      console.log(originalSuperhero);
      const deletedFilename = __dirname + "/public/img/superheroes/"+ originalSuperhero.image;
      console.log(deletedFilename);
      //fs.unlinkSync(deletedFilename);  // delete file synchronously
      
      // delete file asynchronously
      if(fs.existsSync(deletedFilename)){
        fs.unlink(deletedFilename, (err) => {
          if (err) throw err;
          console.log('successfully deleted images from folder superheroes');
        });
      }
      res.redirect('/'); 
    } 
  })




  // MongoClient.connect(url, function (err, client) {
  //     const db = client.db('comics');
  //     const collection = db.collection('superheroes');
  //     const selectedId = req.params.id;

  //     //Delete the old hero image
  //     collection.find({ "_id": ObjectID(selectedId) }).toArray((error, documents) => {
  //       fs.unlink(__dirname + "/public/img/superheroes/" + documents[0].image, (err) => {
  //           if (err) throw err;
  //           console.log('successfully deleted images from folder superheroes');
  //       });
  //     });
  //     //from command line we update an object collection with the following syntax
  //     //db.superheroes.updateOne({"name":"ANT MAN"}, { $set: { "name":"ANT MAN 1"} })

  //     let filter = { "_id": ObjectID(selectedId) };

  //     let updateObject = {
  //         "name": req.body.superhero.toUpperCase(),
  //     }

  //     if (req.file){
  //         console.log("Updating image");
  //         updateObject.image = req.file.filename;
  //     }
      
  //     let update = {
  //         $set: updateObject
  //     };

  //     collection.updateOne(filter, update);

  //     client.close();
  //     res.redirect('/');
  // });
});

// ====================
// COMMENTS ROUTES
// ====================

app.get("/superheroes/:id/comments/new", isLoggedIn, function(req, res){
  // find campground by id
  Superhero.findById(req.params.id, function(err, foundSuperhero){
      if(err){
          console.log(err);
      } else {
           res.render("newcomment", {superhero: foundSuperhero});
      }
  })
});

app.post("/superheroes/:id/comments", isLoggedIn, function(req, res){
  //lookup superhero using ID
  Superhero.findById(req.params.id, function(err, superhero){
      if(err){
          console.log(err);
          res.redirect("/");
      } else {
       Comment.create(req.body.comment, function(err, comment){
          if(err){
              console.log(err);
          } else {
              superhero.comments.push(comment);
              superhero.save();
              res.redirect('/superheroes/' + superhero.id);
          }
       });
      }
  });
  //create new comment
  //connect new comment to campground
  //redirect campground show page
});


//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
  res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
          res.redirect("/superheroes"); 
       });
   });
});

// show login form
app.get("/login", function(req, res){
  res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
   {
       successRedirect: "/superheroes",
       failureRedirect: "/login"
   }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/superheroes");
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
       return next();
   }
   res.redirect("/login");
}
