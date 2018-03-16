
$.getJSON("/articles", function(data) {
	console.log("first:" + data);
	// for (var i = 0; i < data.length; i++) {
		// $("#article").append("<p data-id='" + data[i]._id + "'>" +  "</p>");
	// }
});


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


$(document).on("click", "#article", function(data) {

	$("#comment").empty();

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	.then(function(data) {
	console.log(data);
      // The title of the article
      $("#modal-title").val();
      // // An input to enter a new title
      // $("#comment").append("<input id='titleinput' name='title' >" + "<br>");
      // // A textarea to add a new comment body
      // $("#comment").append("<textarea id='bodyinput' name='body'></textarea>" + "<br>");
      // // A button to submit a new comment, with the id of the article saved to it
      // $("#comment").append("<button data-id='" + data._id + "' id='savecomment'>Save comment</button>");

      // // If there's a comment in the article
      // if (data.comment) {
      //   // Place the title of the comment in the title input
      //   $("#titleinput").val(data.comment.title);
      //   // Place the body of the comment in the body textarea
      //   $("#bodyinput").val(data.comment.body);
      // }

	});
});

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

