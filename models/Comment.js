var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	title: String,
	body: String
});

var Comment = mongoose.model("Comment", CommentSchema);


//Export the Article model
module.exports = Comment;