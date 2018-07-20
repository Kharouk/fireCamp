var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('../models/user');

//Root Route
router.get("/", function(req, res) {
   res.render("landing"); 
});

//==============
// AUTH ROUTES
//==============

//SHOW REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register")
});

//handle signup logic
router.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Thanks for signing up. Welcome to fireCamp " + user.username + ".");
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login",
    
    failureFlash: true
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have succesfully logged out.");
    res.redirect("/campgrounds");
});

module.exports = router;