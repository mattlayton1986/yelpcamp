var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/campgrounds', (req, res) => {
	var campgrounds = [
		{ name: "Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg" },
		{ name: "Granite Hill", image: "https://farm3.staticflickr.com/2923/13950231147_7032e443a0.jpg" },
		{ name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg" }
	];

	res.render('campgrounds', { campgrounds: campgrounds });
});

app.listen(3000, () => {
	console.log('YelpCamp server is running on port 3000');
});