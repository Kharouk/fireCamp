var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
        {name: "Burning Man", image: "https://farm9.staticflickr.com/8156/7317546996_500323aa5e.jpg"},    
        {name: "Algonquin Park", image: "https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},    
        {name: "Nested Shadow Site", image: "https://farm5.staticflickr.com/4364/36704036725_6c89400515.jpg"},
    ];

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res) {
    
    // get data from Form and add to campgrounds array; 
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page;
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new.ejs") 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("fireCamp Server is live!");
});