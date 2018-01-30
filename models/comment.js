var mongoose = require('mongoose');

var Comment = mongoose.model(
	"Comment",
	// Comment Schema
	new mongoose.Schema({
		text: String,
		author: String
	})
);



module.exports = Comment;