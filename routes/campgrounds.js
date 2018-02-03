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
router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
    	name: name, 
    	image: image, 
    	description: desc,
        author: author
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
router.get("/new", isLoggedIn, function(req, res){
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

// EDIT
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            // redirect to show page
            res.redirect('/campgrounds/' + req.params.id)
        }
    });
});

// DELETE
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});


// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
     if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }  
            }
        });
    } else {
       res.redirect('back');
    }
}

module.exports = router;