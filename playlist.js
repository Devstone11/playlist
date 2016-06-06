//Splash Page

var xmlObj = new XMLHttpRequest();
var albumCovers = document.getElementsByClassName("album");

xmlObj.onreadystatechange = function() {
    if (xmlObj.readyState === 4 && xmlObj.status === 200) {
      var myAlbums = JSON.parse(xmlObj.responseText).results;
      var imgArr = [];
      for (var i = 0; i < 3; i++) {
        var randArt = myAlbums.splice(Math.floor(Math.random()*myAlbums.length),1)[0].cover_art;
        imgArr.push("images/"+randArt)
      }
      for (var i = 0; i < albumCovers.length; i++) {
        albumCovers[i].style.backgroundImage = "url("+imgArr[i]+")";
        albumCovers[i].style.backgroundSize = "100%";
      }
    }
};
xmlObj.open("GET", "https://lit-fortress-6467.herokuapp.com/object");
xmlObj.send();

//Playlist Page

$.get("https://lit-fortress-6467.herokuapp.com/object", function(data) {
  data.results.forEach(function(thing) {
    var div = $("<div>");
    div.attr({class: "cover", id: thing.title})
    div.css({"background-image": "url(images/" + thing.cover_art + ")", "background-size": "100%"});
    $('#albums').append(div);
  })
  $('.cover').on("click", function(event) {
    var album = $(this).attr("id")
    var artist = data.results.reduce(function(prev,curr) {
      return (curr.title === album) ? curr.artist : prev;
    }, 0);
    $('#playlist').append(`<div>${artist}: ${album}</div>`);
  })
})

$('#clear').on("click", function() {
  $('#playlist').empty();
})

$('#submit').on("click", function() {
  $.post("https://lit-fortress-6467.herokuapp.com/post", function(data) {
    console.log(data);
  })
  $('#playlist').empty();
})
