//---------------------------------//
//----- Variable Definitions -----//
var map;
var names = [];
var lat = [];
var long = [];
var links = [];
var marker;
var infowindow;

//---------------------------------//
//----- Function Definitions -----//

function loop(data){
  for(var i in data.businesses){
    // Create arrays to hold names and addresses
    names.push(data.businesses[i].name);
    lat.push(data.businesses[i].location.coordinate.latitude);
    long.push(data.businesses[i].location.coordinate.longitude);
    links.push(data.businesses[i].url);
  }
}

function initMap(lat,long) {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat[0], lng: long[0]},
    scrollwheel: false,
    zoom: 12
  });
}

function createMarkers(lat,long){
  for (var j in lat){
    marker = new google.maps.Marker({
      position: {lat: lat[j], lng: long[j]},
      title: names[j],
      map: map
    });

    var content = '<a href="' + links[j] + '" target="_blank">' + names[j] + '</a>';
    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
        return function() {
           infowindow.setContent(content);
           infowindow.open(map,marker);
        };
    })(marker,content,infowindow));
  }
}

//--------------------------//
//----- Functionality -----//

$(document).ready(function(){

  // Key Down Definitions
  $(".location").keydown(function(event){
    if(event.keyCode == 13){
      event.preventDefault();
      $(".submit").trigger("click");
    }
  });

  // Jquery call upon 'submit' button click
  $(".submit").click(function(event){
    event.preventDefault();
    // Reset names, lat, long, and links arrays so that map can be reset on every search
    names = [];
    lat = [];
    long = [];
    links = [];

    // Create location variable based on user input
    var location = $(".location").val();

    // Search yelp for karaoke bars, loop through data to populate arrays, and create google maps with results
    $.post("https://galvanize-yelp-api.herokuapp.com/search", {term: "karaoke", location: location})
    .done(function (data) {
      loop(data);
      initMap(lat,long);
      createMarkers(lat,long);
    });

  });

});
