var mongoose = require('mongoose'),
		Campground = require('./models/campground'),
		Comment = require('./models/comment');

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {username: "lucas", id: "5a713f0574357d01605141b0"},
        cost: 10
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {username: "mattlayton86", id: "5a70fd56c3c05d6f6ae6ec48"},
        cost: 12.25
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {username: "mattlayton86", id: "5a70fd56c3c05d6f6ae6ec48"},
        cost: 11.50
    }
];


function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('removed campgrounds!');
			// Add a few campgrounds
			data.forEach((seed) => {
				Campground.create(seed, (err, campground) => {
					if (err) {
						console.log(err);
					} else {
						console.log('Added a campground!');

						// create a comment
						Comment.create(
							{
								text: "This place is great, but I wish there was internet",
								author: "Homer"
							},
							(err, comment) => {
								if (err) {
									console.log(err);
								} else {
									// will need changed to campground.comments.push(comment._id)
									campground.comments.push(comment._id);
									campground.save();
									console.log("Created new comment");
								}
							} 
						);
					}
				});
			});
		}	
	});

	
	

	// Add a few comments

}

module.exports = seedDB;