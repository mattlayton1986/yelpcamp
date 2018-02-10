
var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var Campground = require('../models/campground');

// fallback adminSecret used for development only
var adminSecret = process.env.ADMIN_SECRET || 'password';

// Root Route
router.get('/', (req, res) => {
	res.render('landing');
});

// REGISTER FORM
router.get('/register', ( req, res ) => {
	res.render('register', {page: 'register'});
});

// REGISTER CREATE
router.post('/register', ( req, res ) => {
	var newUser = new User({
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			avatar: req.body.avatar,
			email: req.body.email
		});
	if (req.body.admin === adminSecret) {
		newUser.isAdmin = true;
	} else {
		console.log(adminSecret);
	}
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to YelpCamp ' + user.username);
			res.redirect('/campgrounds');
		}); 
	});
})

// LOGIN FORM
router.get('/login', ( req, res ) => {
	res.render('login', {page: 'login'});
});

// LOGIN LOGIC
router.post('/login', 
					passport.authenticate('local', 
					{
						successRedirect: '/campgrounds',
						failureRedirect: '/login'
					}), 
					( req, res ) => {}
);

// LOGOUT
router.get('/logout', ( req, res ) => {
	req.logout();
	req.flash('success', "Logged you out!");
	res.redirect('/campgrounds');
});

// USER PROFILE
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {
			req.flash('error', 'Sorry, this user could not be found.');
			res.redirect('back');
		}
		Campground.find().where('author.id').equals(foundUser.id).exec((err, campgrounds) => {
			if (err) {
				req.flash('error', 'Something went wrong');
				req.redirect('back');
			}
			res.render('users/show', {user: foundUser,
																campgrounds: campgrounds});
		});
	});
});

module.exports = router; 