//Splash Page - raw javascript

var xmlObj = new XMLHttpRequest();
var albumCovers = document.getElementsByClassName("album");

xmlObj.onreadystatechange = function() {
    if (xmlObj.readyState === 4 && xmlObj.status === 200) {
      var myAlbums = JSON.parse(xmlObj.responseText).albums;
      // console.log(myAlbums);
      var imgArr = [];
      for (var i = 0; i < 3; i++) {
        var randArt = myAlbums.splice(Math.floor(Math.random()*myAlbums.length),1)[0].images[1].url;
        imgArr.push(randArt)
      }
      for (var i = 0; i < albumCovers.length; i++) {
        albumCovers[i].style.backgroundImage = "url("+imgArr[i]+")";
        albumCovers[i].style.backgroundSize = "100%";
      }
    }
};
xmlObj.open("GET", "https://api.spotify.com/v1/albums/?ids=3NW7YlpaDa97jm259PIVCZ,0eQlvrTmnyi2HCzTlu1K9h,6TnJIiTtpSN4nQ64baw98y,1pQORO53AVvYinNFHJV2nh,2g0pjNFOGoKLlTP3GYouQA,6t3rvzvhC8lYvUwQLGH2BS,52Jy38DS81t5WdmsAw7Pbp,5814CZODdBLAbR9o3Vmw8S,7DjHF5MrTAamJRA2ffGq5P,2iI3eaYut9mBQ4jdBxnjDR,6C3nJC4oSZ8suGCi7Dde0i,6UPjOxqBNCDccXuEV5BNBf,1yIirSh11NsvcAUGATuSom,0KLIgHdbiAlmZXf7bmB7hI,6WP7K6Mn034qAGkHZc2892,7zyMzLKVWwksHhf5UvOwjf,2Aj14TcYeyGwpVhUMYxpQI,0LscekRzhfMQXuyTlJOTmZ,43ZhkQC08zbE7PDzMwhLpI,6zRtKtjdH9Vmx0KsgMK0hO");
xmlObj.send();

//Playlist Page - jQuery

$.get("https://api.spotify.com/v1/albums/?ids=3NW7YlpaDa97jm259PIVCZ,0eQlvrTmnyi2HCzTlu1K9h,6TnJIiTtpSN4nQ64baw98y,1pQORO53AVvYinNFHJV2nh,2g0pjNFOGoKLlTP3GYouQA,6t3rvzvhC8lYvUwQLGH2BS,52Jy38DS81t5WdmsAw7Pbp,5814CZODdBLAbR9o3Vmw8S,7DjHF5MrTAamJRA2ffGq5P,2iI3eaYut9mBQ4jdBxnjDR,6C3nJC4oSZ8suGCi7Dde0i,6UPjOxqBNCDccXuEV5BNBf,1yIirSh11NsvcAUGATuSom,0KLIgHdbiAlmZXf7bmB7hI,6WP7K6Mn034qAGkHZc2892,7zyMzLKVWwksHhf5UvOwjf,2Aj14TcYeyGwpVhUMYxpQI,0LscekRzhfMQXuyTlJOTmZ,43ZhkQC08zbE7PDzMwhLpI,6zRtKtjdH9Vmx0KsgMK0hO", function(data) {
  data.albums.forEach(function(thing) {
    var div = $("<div>");
    div.attr({class: "cover", id: thing.name})
    div.css({"background-image": "url(" + thing.images[1].url + ")", "background-size": "100%"});
    $('#insideAlbums').append(div);
  })
  $('.cover').on("click", function(event) {
    $('#inner-choice').empty();
    $('#album-tracks').empty();

    var album = $(this).attr("id");

    var artist = data.albums.reduce(function(prev,curr) {
      return (curr.name === album) ? curr.artists[0].name : prev;
    }, 0);

    var imgSrc = data.albums.reduce(function(prev,curr) {
      return (curr.name === album) ? curr.images[1].url : prev;
    }, 0);

    var tracks = data.albums.reduce(function(prev,curr) {
      return (curr.name === album) ? curr.tracks.items : prev;
    }, 0);

    var img = $("<img src="+ imgSrc +">");
    img.css({"height": "90px", "width": "90px", "position": "absolute", "right": "25px"});

    $('#inner-choice').append("<div>"+artist +": "+ album + "</div>").append(img);
    $('.post-results').hide();

    tracks.forEach(function(obj) {
      $('#album-tracks').append("<div class='song' id="+obj.name+">"+obj.name+"</div>");
    })

    $('.song').on('click', function(event) {
      var songCopy = $("<div>" + $(this).html() + "</div>")
      $('#playlist-tracks').append(songCopy);
    })
  })

})

$('#clear').on("click", function() {
  $('#playlist-tracks').empty();
  $('.post-results').hide();
})

var postDiv = function(contents) {
  return $("<div class='post-results'>" + contents + "</div>").css("margin", "15px 40px");
};

$('#submit').on("click", function() {
  $.post("https://lit-fortress-6467.herokuapp.com/post", function(data) {
    $('main').append(postDiv(data));
  })
  $('#playlist-tracks').empty();
  $('.cover').show();
})
