var mongoose = require("mongoose");
//Create the schema class using mongoose's schema method
var Schema = mongoose.Schema;

//Create the ArticleSchema with the schema object
var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type:String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	//associate with comment
	note: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}

});

//Creat the Article model using the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);


//Export the Article model
module.exports = Article;