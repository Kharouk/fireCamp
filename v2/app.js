var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/firecamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SET UP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

    // Campground.create({
    //     name: "Algonquin Park", 
    //     image: "https://wildernessadventures.ca/wp-content/uploads/2014/11/Algonquin-Camp-Canoe-Trips-1.jpg",
    //     description: "Would you believe me if I said there was an untouched paradise just two hours north of Toronto? Algonquin Park's campsites offer undisturbed peace and quiet. Reserve now!"
    //     }, 
    //     function(err, campground){
    //         if (err) {
    //             console.log(err);
    //     }   else {
    //             console.log("NEW CAMPGROUND HAS BEEN CREATED");
    //             console.log(campground);
    //     }
    // });

// var campgrounds = [
//         {name: "Burning Man", image: "https://farm9.staticflickr.com/8156/7317546996_500323aa5e.jpg"},    
//         {name: "Algonquin Park", image: "https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},    
//         {name: "Nested Shadow Site", image: "https://farm5.staticflickr.com/4364/36704036725_6c89400515.jpg"},
//     ];

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
            res.render("index", {campgrounds:allCampgrounds});
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
   res.render("new.ejs") 
});

//SHOW ROUTE - Shows more information about the campground.
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID 
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            //and render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("fireCamp Server is live!");
});