// Define Variables
var map;
var names = [];
var lat = [];
var long = [];
var links = [];
var marker;
var infowindow;

// Define Functions

function initMap(lat,long) {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat[0], lng: long[0]},
    scrollwheel: false,
    zoom: 10
  });
}

function loop(data){
  for(var i in data.businesses){
    // Create arrays to hold names and addresses
    names.push(data.businesses[i].name);
    lat.push(data.businesses[i].location.coordinate.latitude);
    long.push(data.businesses[i].location.coordinate.longitude);
    links.push(data.businesses[0].url);
  }
}

function createMarkers(lat,long){
  for (var j in lat){
    marker = new google.maps.Marker({
      position: {lat: lat[j], lng: long[j]},
      title: names[j],
      draggable: true,
      map: map
    });

    var content = '<a href="' + links[j] + '" target="_blank">' + names[j] + '</a>';
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
        return function() {
           infowindow.setContent(content);
           infowindow.open(map,marker);
        };
    })(marker,content,infowindow));
  }
}



$(document).ready(function(){

  // Jquery call upon 'submit' button click
  $(".submit").click(function(){

    var location = $(".location").val();
    console.log(location);

    $.post("https://galvanize-yelp-api.herokuapp.com/search", {term: "karaoke", location: location})
    .done(function (data) {
      loop(data);
      initMap(lat,long);
      createMarkers(lat,long);
    });

  });

});
