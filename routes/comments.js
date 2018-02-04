var express = require('express');
var router = express.Router( {mergeParams: true} );

var Campground = require('../models/campground');
var Comment = require('../models/comment');

// NEW
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

// CREATE
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
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
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

// EDIT
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {campground_id: req.params.id,
																		comment: foundComment});
		}
	});
});

// UPDATE
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
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

function checkCommentOwnership(req, res, next) {
     if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
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