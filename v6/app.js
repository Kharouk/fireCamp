var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")

mongoose.connect("mongodb://localhost/firecamp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();    

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "I like butts",
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

app.get("/", function(req, res) {
   res.render("landing"); 
});


// INDEX ROUTE - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res) {
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
app.post("/campgrounds", function(req, res) {
    
    // get data from Form and add to campgrounds array; 
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: image, description:desc};
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log("AN ERROR OCCURED")
        } else {
            // redirect back to campgrounds page;
            res.redirect("/campgrounds"); 
        }
    })
    
});

//THE 'NEW' ROUTE - SHOW FORM TO CREATE NEW CAMPGROUND
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new") 
});

//SHOW ROUTE - Shows more information about the campground.
app.get("/campgrounds/:id", function(req, res) {
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

// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground to page
});
//==============
// AUTH ROUTES
//==============

//SHOW REGISTER FORM
app.get("/register", function(req, res) {
    res.render("register")
});
//handle signup logic
app.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});
//handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("fireCamp Server is live!");
});