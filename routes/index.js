
var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
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
	var newUser = new User(
    {
      username: req.body.username,
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

// SHOW FORGOT PASSWORD
router.get('/forgot', (req, res) => {
	res.render('forgot');
});

// POST FORGOT PASSWORD
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        // change this info
        auth: {
          user: process.env.GMAILADDR,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// RESET GET
router.get('/reset/:token', (req, res) => {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, (err, user) => {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired');
			return res.redirect('/forgot');
		}
		res.render('reset', {token: req.params.token});
	});
});

// RESET POST
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILADDR,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

// LOGOUT
router.get('/logout', ( req, res ) => {
	req.logout();
	req.flash('success', "Logged you out!");
	res.redirect('/campgrounds');
});

module.exports = router; 