
var mongoose = require('mongoose');


var Campground = mongoose.model(
	"Campground", 
	// Campground Schema
	new mongoose.Schema({
		name: String,
		image: String,
		description: String
}));

// Export Campground model
module.exports = Campground;