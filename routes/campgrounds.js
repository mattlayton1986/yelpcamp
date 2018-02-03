var express = require('express');
var router = express.Router();

var Campground = require('../models/campground');

// INDEX 		- show all campgrounds
router.get('/', (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: campgrounds,
																				currentUser: req.user});
		}
	});
});

// CREATE 	- add new campground to database
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {
    	name: name, 
    	image: image, 
    	description: desc
    };
    // Create a new campground and save to DB
    Campground.create(newCampground, (err, newCampground) => {
    	if (err) {
    		console.log(err);
    	} else {
    		//redirect back to campgrounds page
    	res.redirect("/campgrounds");
    	}
    });
});

// NEW 			- form to add new campground
router.get("/new", function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW 		- display details of one campground
router.get('/:id', (req, res) => {
	// find campground with provided id
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});	
});

module.exports = router;