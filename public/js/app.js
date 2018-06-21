
console.log("hide modal");
$.getJSON("/articles", function(data) {
	console.log("first:" + data);

});

//scrape new article button trigger function to get new articles
$(document).on("click", ".scrape-new", function() {
	console.log("page reloaded!");
	$.ajax({
		method: "GET",
		url: "/scrape"
	})
	.then(function(data) {
		console.log("this is NEW data", data);
		window.location.reload();
	});
});


//save the comments for each article
$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the comment section
      $("#comment").empty();
    });

  // Also, remove the values entered in the input and textarea for comment entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(".submitCommentBtn").on("click", function(event) {

  event.preventDefault();

  $(".addCommentInput").each(function(input) {
    input.value = "";
  });

  var commentData = $(".addCommentForm").serializeArray();
  console.log("this commentData", commentData);

  var newComment = {
    title: commentData[1].value,
    body: commentData[2].value
  };

  $.ajax({
    method: "POST",
    url: "/comment/" + commentData[0].value,
    data: newComment
  })
  .then(function(data) {
    console.log("commentDataBtn", data);
  });

});

//once click on comment button which have the value of the data id
$(".comment-btn").on("click", function(event) {
  console.log(this);
  $("#targetArticle").val(this.dataset.id);
}); 