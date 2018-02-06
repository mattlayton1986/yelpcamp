
var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

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
	var newUser = new User({username: req.body.username});
	if (req.body.admin === ADMIN_SECRET || 'password') {
		newUser.isAdmin = true;
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

module.exports = router; 