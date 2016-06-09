//Splash Page
var spotifyUrl = "https://api.spotify.com/v1/albums/?ids=3NW7YlpaDa97jm259PIVCZ,0eQlvrTmnyi2HCzTlu1K9h,6TnJIiTtpSN4nQ64baw98y,1pQORO53AVvYinNFHJV2nh,2g0pjNFOGoKLlTP3GYouQA,6t3rvzvhC8lYvUwQLGH2BS,52Jy38DS81t5WdmsAw7Pbp,5814CZODdBLAbR9o3Vmw8S,7DjHF5MrTAamJRA2ffGq5P,2iI3eaYut9mBQ4jdBxnjDR,6C3nJC4oSZ8suGCi7Dde0i,6UPjOxqBNCDccXuEV5BNBf,1yIirSh11NsvcAUGATuSom,0KLIgHdbiAlmZXf7bmB7hI,6WP7K6Mn034qAGkHZc2892,7zyMzLKVWwksHhf5UvOwjf,2Aj14TcYeyGwpVhUMYxpQI,0LscekRzhfMQXuyTlJOTmZ,43ZhkQC08zbE7PDzMwhLpI,6zRtKtjdH9Vmx0KsgMK0hO"

$.get(spotifyUrl, function(data) {
  var imgArr = selectRandomImg(data);
  assignBackground(imgArr);
})

function selectRandomImg(data) {
  var myAlbums = data.albums;
  var imageArray = [];
  for (var i = 0; i < 3; i++) {
    var randAlbum = myAlbums.splice(Math.floor(Math.random()*myAlbums.length),1)
    var randArt = randAlbum[0].images[1].url;
    imageArray.push(randArt)
  }
  return imageArray;
}

function assignBackground(array) {
  var counter = 0;
  $('.album').each(function() {
    $(this).css({"background-image": "url("+array[counter]+")", "background-size": "100%"})
    counter++;
  })
}

//Playlist Page - jQuery
$(document).ready(function() {
  loadAlbumCovers();
  $(document).on('click', '.cover', displayAlbumInfo);
  $(document).on('click', '.album-tracks .song', addToPlaylist);
  $(document).on('click', '#clear', clearTracks);
  $(document).on('click', '#submit', submit);
  $(document).on('click', '.song-copy', showPreview);
  $(document).on('click', '#delete', deleteSong);

  function loadAlbumCovers() {
    $.get(spotifyUrl, function(data) {
      data.albums.forEach(function(thing) {
        var div = $("<div>");
        div.attr({class: "cover", id: thing.name})
        div.css({"background-image": "url(" + thing.images[1].url + ")", "background-size": "100%"});
        $('#insideAlbums').append(div);
      })
    })
  }

  function displayAlbumInfo() {
    var album = $(this).attr("id");
    $('#inner-choice').empty();
    $('.album-tracks').empty();
    $.get(spotifyUrl, function(data) {
      var albumList = data.albums
      showSummary(albumList, album);
      showTracks(albumList, album);
    })
  }

  function showSummary(data, album) {
    var artist = getSummaryInfo(data, album, "artists", 0, "name")
    var coverImgSource = getSummaryInfo(data, album, "images", 1, "url");
    var img = $("<img />", {src: coverImgSource});
    img.css({"height": "90px", "width": "90px", "position": "absolute", "right": "25px"});
    $('#inner-choice').append("<div>"+artist +": "+ album + "</div>").append(img);
  }

  function getSummaryInfo(data, album, key1, num, key2) {
    return  data.reduce(function(prev,curr) {
      return (curr.name === album) ? curr[key1][num][key2] : prev;
    }, 0);
  }

  function showTracks(data, album) {
    var tracks = data.reduce(function(prev,curr) {
      return (curr.name === album) ? curr.tracks.items : prev;
    }, 0);
    tracks.forEach(function(obj) {
      $('.album-tracks').append("<div class='song' id="+obj.preview_url+">"+obj.name+"</div>");
    })
  }

  function addToPlaylist() {
    var songPrevUrl = $(this).attr("id");
    var songName = $(this).html();
    var songCopy = $("<div class='song song-copy' id="+songPrevUrl+">" + songName + "</div>")
    $('.playlist-tracks').append(songCopy);
  }

  function showPreview() {
    $(".song").removeClass("selected");
    $(this).addClass("selected");
    var songPrevUrl = $(this).attr("id");
    var prevPlayer = $("<audio controls src='"+$(this).attr("id")+"'</audio>");
    $(".preview").html("Preview this track:");
    $(".preview").append(prevPlayer);
  }

  function deleteSong() {
    $(".selected").hide();
  }

  function clearTracks() {
    $('.playlist-tracks').empty();
    $('.preview').empty();
    $('.post-results').hide();
  }

  function submit() {
    $.post("https://lit-fortress-6467.herokuapp.com/post", function(data) {
      $('main').append(postDiv(data));
    })
    $('.playlist-tracks').empty();
  }

  function postDiv(contents) {
    return $("<div class='post-results'>" + contents + "</div>").css("margin", "15px 40px");
  }
})
