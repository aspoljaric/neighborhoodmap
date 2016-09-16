var googleMapsAPIUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
var googleMapsAPIKey = 'AIzaSyAbmfw7OfezCJs7qpCOQQZ7IB46SKTQZ14';
var map;
var markers = [];
var mapCenter = {lat: -37.8203576, lng: 144.9516255}; // Melbourne, Australia
var infowindow;
var currentMarker;


function initGoogleMap() {
  infowindow = new google.maps.InfoWindow({
  });

  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 11,
  center: mapCenter
  });
}


function centreMap() {
  if(map != undefined) {
    map.setZoom(11);
    map.setCenter(mapCenter);
  }
}


function closeInfoWindow(marker) {
  toggleMarker(marker);
  marker.setAnimation(null);
  map.setZoom(11);
  map.setCenter(mapCenter);
}



function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}



function createMarkerByGeoCoordinates(latLng) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    animation: google.maps.Animation.DROP
  });

  marker.addListener('click', openInfoWindowByMarker.bind(map, marker), false);
  markers.push(marker);
  return marker;
}



function toggleMarker(marker) {
  if(marker != undefined) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
      map.setZoom(11);
      map.setCenter(mapCenter);
    }
    else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      google.maps.event.addListener(infowindow,'closeclick', closeInfoWindow.bind(null, marker), false);
      map.setZoom(15);
      map.setCenter(marker.getPosition());
    }
  }
}



function addMarkerToGoogleMap(address, isToggle) {
  var url = googleMapsAPIUrl + 'address=' + address + '&key=' + googleMapsAPIKey;

  $.getJSON(url)
    .done(function(data) {
        processMarkerData(data, isToggle);
    })
    .fail(function(){
         setAPIFailMessage("Unable to connect to Google.");
    });
}



function processMarkerData(data, isToggle){
  var lat = data.results[0].geometry.location.lat;
  var lng = data.results[0].geometry.location.lng;
  myLatLng = {lat: lat, lng: lng};

  if(myLatLng != undefined) {
    var marker = createMarkerByGeoCoordinates(myLatLng);
    if(isToggle == true) {
      marker.animation = null;
      toggleMarker(marker);
    }
  }
}



function populateInfoWindowContent(businessName, phoneNumber, ratingImg, imgUrl, snippetText, mobileURL) {
  var contentString = '<div id="content">'+
      '<a href='+ mobileURL + '><h3>' + businessName + '</h3></a>'+
      '<div id="bodyContent">'+
      '<img src=' + imgUrl + '>' +
      'Phone: ' + phoneNumber + '<br>' +
      'Rating: <img src=' + ratingImg + ' alt="Rating"> <br><br>' +
      'Latest Review: <i>' + snippetText + '</i>' +
      '</div>'+
      '</div>';

  infowindow.setContent(contentString);
}



function reverseGeolocation(marker, processesGeolocation) {
  var geocoder = new google.maps.Geocoder;
  var latlng = marker.position;

  geocoder.geocode({
    latLng: latlng
  }, function(responses) {
    processesGeolocation(responses);
  });
}



function openInfoWindowByMarker(marker) {
  infowindow.setContent('');
  toggleMarker(currentMarker);
  var formattedAddress;
  reverseGeolocation(marker,function(address){
     formattedAddress = address[0].formatted_address;
     populateInfoWindowFromYelp(formattedAddress);
     toggleMarker(marker);
     currentMarker = marker;
     infowindow.open(map, marker);
  });
}



function openInfoWindowByAddress(address) {
  infowindow.setContent('');
  toggleMarker(currentMarker);
  var marker;
  for(var i = 0; i < markers.length; i++) {
    var lat = markers[i].position.lat();
    var lng = markers[i].position.lng();

    if(address.latLng().lat == lat && address.latLng().lng == lng) {
        marker = markers[i];
    }
  }

  getYelpInformationByLocation(address.fullAddress());
  toggleMarker(marker);
  currentMarker = marker;
  infowindow.open(map, marker);
}



function populateInfoWindowFromYelp(address) {
  getYelpInformationByLocation(address);
}