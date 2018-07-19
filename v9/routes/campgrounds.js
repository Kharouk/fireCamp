var express     = require('express'),
    router      = express.Router(),
    Campground  = require('../models/campground'),
    Comment     = require('../models/comment');
    

// INDEX ROUTE - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res) {
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log("There was an error.");
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    })
});

//CREATE ROUTE - ADD NEW CAMPGROUND TO DB
router.post("/", isLoggedIn, function(req, res) {
    
    // get data from Form and add to campgrounds array; 
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
            id: req.user._id,
            username: req.user.username
    };
    let newCampground = {name: name, image: image, description:desc, author:author};
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log("AN ERROR OCCURED")
        } else {
            // redirect back to campgrounds page;
            console.log(newlyCreated);
            res.redirect("/campgrounds"); 
        }
    })
    
});

//THE 'NEW' ROUTE - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", isLoggedIn, function(req, res) {
   res.render("campgrounds/new") 
});

//SHOW ROUTE - Shows more information about the campground.
router.get("/:id", function(req, res) {
    //find the campground with provided ID 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            //and render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;