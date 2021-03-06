var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground ) {
        req.flash('error', 'Oops, something went wrong! Try again.');
        res.redirect('/campgrounds');
      } else {
        if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
          }  
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash('error', 'Oops, something went wrong! Try again.');
        res.redirect('/campgrounds');
      } else {
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }  
    	}
    });
  } else {
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
  req.flash("error", "You need to be logged in to do that");
	res.redirect('/login');
}

module.exports = middlewareObj;