// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "news";
var collections = ["artilesdb"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});


//Routes
//home page route
app.get("/", function(req, res) {
	request("https://www.nytimes.com/", function(error, response, html) {
		var $ = cheerio.load(html);

		$("article.theme-summary").each(function(i, element) {
			var header = $(element).children().children("a").attr("href");

			if(title && link) {
				db.artilesdb.insert({
					header: header
				}, 
				function(err, inserted) {
					if (err) {
						console.log(err);
					} else {
						console.log(inserted);
					}

				});
			}

		});

	});


});




//listen on port 8000
app.listen(8000, function() {
	console.log("App running on port 8000");
});