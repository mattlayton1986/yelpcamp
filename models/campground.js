
var mongoose = require('mongoose');


var Campground = mongoose.model(
	"Campground", 
	// Campground Schema
	new mongoose.Schema({
		name: String,
		image: String,
		description: String,
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			username: String
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment"
			}
		]
}));

// Export Campground model
module.exports = Campground;