var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Set the route for home page
router.get("/", function(req, res){
  res.render("landing");
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
  res.render("register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
  res.render("login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
   {
       successRedirect: "/superheroes",
       failureRedirect: "/login"
   }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/superheroes");
});

module.exports = router;