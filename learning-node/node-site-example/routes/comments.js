var express = require("express");
var router  = express.Router({mergeParams: true});
var Superhero = require("../models/superhero");
var Comment = require("../models/comment");


// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", isLoggedIn, function(req, res){
  // find campground by id
  console.log(req.params.id);
  Superhero.findById(req.params.id, function(err, foundSuperhero){
      if(err){
          console.log(err);
      } else {
           res.render("newcomment", {superhero: foundSuperhero});
      }
  })
});

router.post("/", isLoggedIn, function(req, res){
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
            //add username and id to comment
            console.log(req.user)
            comment.author.id = req.user.id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
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

//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

module.exports = router;