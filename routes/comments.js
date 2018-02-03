var express = require('express');
var router = express.Router( {mergeParams: true} );

var Campground = require('../models/campground');
var Comment = require('../models/comment');

// Comments New
router.get('/new', isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

// Comments Create
router.post('/', isLoggedIn,  (req, res) => {
	// look up campground using ID
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					// connect new comment to campground
					campground.comments.push(comment._id);
					campground.save();
					// redirect to campground show page					
					res.redirect('/campgrounds/' + req.params.id);
				}
			});	
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

module.exports = router;