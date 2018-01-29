var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	text: String,
	author: String
});

var Comment = mongoose.model(
	"Comment",
	// Comment Schema
	new mongoose.Schema({
		text: String,
		author: String
	})
);



module.exports = Comment;