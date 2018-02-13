var express = require('express');
var router = express.Router();
var geocoder = require('geocoder');

var Campground = require('../models/campground');
var middleware = require('../middleware');

// INDEX 		- show all campgrounds
router.get('/', (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, (err, searchResults) => {
            if (err) {
                console.log(err);
            } else {
                if (searchResults.length === 0) {
                    req.flash('error', 'Sorry, no campgrounds match your query. Please try again');
                    return res.redirect('/campgrounds');
                }
                res.render('campgrounds/index', {campgrounds: searchResults,
                                                 page: 'campgrounds' });
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (err) {
                console.log(err);
            } else {
                res.render('campgrounds/index', {campgrounds: allCampgrounds,
                                                 page: 'campgrounds' });
            }
        });
    }
});

// CREATE 	- add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
    geocoder.geocode(req.body.campground.location, (err, data) => {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;

        // get data from form and add to campgrounds array
        var newCampground = req.body.campground;
        newCampground.author = {
            id: req.user._id,
            username: req.user.username
        };

        // add geocoder data to Campground object
        newCampground.lat = lat;
        newCampground.lng = lng;
        newCampground.location = location;

        // Create a new campground and save to DB
        Campground.create(newCampground, (err, newlyCreated) => {
            if (err) {
                console.log(err);
            } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
            }
        });

    });
});

// NEW 			- form to add new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW 		- display details of one campground
router.get('/:id', (req, res) => {
	// find campground with provided id
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err || !foundCampground) {
			req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
		} else {
			console.log(foundCampground);
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});	
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.campground.location, (err, data) => {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;

        updatedCampground = req.body.campground;
        updatedCampground.lat = lat;
        updatedCampground.lng = lng;
        updatedCampground.location = location;
        // find and update correct campground
        Campground.findByIdAndUpdate(req.params.id, updatedCampground, (err, newlyUpdated) => {
            if (err) {
                req.flash('error', err.message);
                res.redirect('back');
            } else {
                // redirect to show page
                req.flash('success', "Successfully Updated!");
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });
});

// DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;