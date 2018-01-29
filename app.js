// *** INITIALIZE APP *** //
// ********************** //

var app 				= require('express')(),
		mongoose 		= require('mongoose'),
		bodyParser 	= require('body-parser'),

		Campground 	= require('./models/campground'),

		seedDB 			= require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded( {extended: true} ));
app.set('view engine', 'ejs');

seedDB();

// *** ROUTES *** //
// ************** //

// HOME PAGE
app.get('/', (req, res) => {
	res.render('landing');
});

// INDEX 		- show all campgrounds
app.get('/campgrounds', (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, (err, campgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', {campgrounds: campgrounds});
		}
	});
});

// CREATE 	- add new campground to database
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
   res.render("new"); 
});

// SHOW 		- display details of one campground
app.get('/campgrounds/:id', (req, res) => {
	// find campground with provided id
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render('show', {campground: foundCampground});
		}
	});	
});


// *** SERVER *** //
// ************** //
app.listen(3000, () => {
	console.log('YelpCamp server is running on port 3000');
});