var mongoose = require('mongoose');

var Comment = mongoose.model(
	"Comment",
	// Comment Schema
	new mongoose.Schema({
		text: String,
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			username: String
		}
	})
);



module.exports = Comment;