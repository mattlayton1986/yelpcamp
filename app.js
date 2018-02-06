// *** INITIALIZE APP *** //
// ********************** //

var express								= require('express'),
		app 									= express(),
		mongoose 							= require('mongoose'),
		bodyParser 						= require('body-parser'),
		expressSession 				= require('express-session'),
		passport							= require('passport'),
		LocalStrategy 				= require('passport-local'),
		methodOverride				= require('method-override'),
		flash									= require('connect-flash'),

		Campground 						= require('./models/campground'),
		Comment 							= require('./models/comment'),
		User									= require('./models/user'),

		seedDB 								= require('./seeds');

		// require routes
var commentRoutes 				= require('./routes/comments'),
		campgroundRoutes 			= require('./routes/campgrounds'),
		indexRoutes 					= require('./routes/index.js');

mongoose.connect(process.env.DATABASEURL);
// mongoose.connect('mongodb://matt:password@ds125058.mlab.com:25058/wdb-yelpcamp');

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'WDB rocks!',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


// *** SERVER *** //
// ************** //
app.listen(process.env.PORT, process.env.IP, () => {
	console.log('YelpCamp server is running on port 3000');
});

