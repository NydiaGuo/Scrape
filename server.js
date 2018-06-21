// Dependencies
var express = require("express");
// var mongojs = require("mongojs");
// var request = require("request");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var bodyParser = require("body-parser");


//Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local crapenews database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/crapenews";

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect( MONGODB_URI, {
//   useMongoClient: true
});

var axios = require("axios");
var cheerio = require("cheerio");


//Routes
app.get("/", function(req, res) {
	//Grab the info in the Articles collection
	db.Article.find({})
	.sort({ _id:-1 }).limit(5)
	.then(function(data) {
		res.render("index", { news: data });
		console.log("this is home page", data);
	})
	.catch(function(err){
		console.log(err);
	});

});

//Scrap the NYT website
app.get("/scrape", function(req, res) {
	console.log("scraped!");

	//Get the body of the html with request
	axios.get("https://www.nytimes.com/").then(function(response) {
		//load the whole thing into cheerio and save it to $ 
		var $ = cheerio.load(response.data);

		$(".theme-summary").each(function(i, element) {
			//Save an empty result object to hold the title, link and summary
			var result = {};
			
			result.title = $(this).children("a").text().trim();
			result.link = $(this).children(".story-heading").children("a").attr("href");
			result.sum = $(this).children(".summary").text().trim();


			//Create a new Article using the 'result' object built from scraping
			db.Article.create(result)
			.then(function(dbArticle) {
				//Show the added result in console
				console.log("-----------------------new articles added---------------------------------");
			})
			.catch(function(err) {
				return res.json(err);
			});
		});
		//If it was able to scrape and save an Article, send a message to the client
		res.send("Scrape Complete!");
	});
});

//Getting all the Articles from the database
app.get("/articles", function(req, res) {

	//Grab the info in the Articles collection
	db.Article.find({})
	.then(function(dbArticle) {
		//If could find Articles, then send it back to the client
		console.log("this is dbArticle", dbArticle);
		console.log("========================the end of dbArticle=======================");
		res.render("index", { news: dbArticle });
	})
	.catch(function(err) {
		res.json(err);
	});

});


//Getting a specific Article by id and populate it with the comment
app.get("/articles/:id", function(req, res) {
	//Using the id passed in the id parameter, prepare a query that finds the matching one in the db
	db.Article.findOne({_id: req.params.id})
	.populate("note")
	.then(function(dbArticle) {
		//If would find an Article with the given id, send it to the client
		res.json(dbArticle);
	})
	.catch(function(err) {
		res.json(err);
	});
});


app.post("/comment/:articleID", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.articleID }, { note: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//listen on port 3000
app.listen(PORT, function() {
	console.log("App running on port " + PORT);
});
