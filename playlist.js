var xmlObj = new XMLHttpRequest();
var albumCovers = document.getElementsByClassName("album");

xmlObj.onreadystatechange = function() {
    if (xmlObj.readyState === 4 && xmlObj.status === 200) {
      var myAlbums = JSON.parse(xmlObj.responseText).results;
      var imgArr = [];
      for (var i = 0; i < 3; i++) {
        var randArt = myAlbums.splice(Math.floor(Math.random()*myAlbums.length),1)[0].cover_art;
        if (randArt === "the_division_bell.jpg") {
          imgArr.push("images/division_bell.jpg")
        }else{
          imgArr.push("images/"+randArt)
        };
      }
      for (var i = 0; i < albumCovers.length; i++) {
        albumCovers[i].style.backgroundImage = "url("+imgArr[i]+")";
        albumCovers[i].style.backgroundSize = "100%";
      }
      console.log(imgArr);
    }
};

xmlObj.open("GET", "https://lit-fortress-6467.herokuapp.com/object");
xmlObj.send();
