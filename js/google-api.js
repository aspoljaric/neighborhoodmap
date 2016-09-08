var googleMapsAPIUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
var googleMapsAPIKey = 'AIzaSyAbmfw7OfezCJs7qpCOQQZ7IB46SKTQZ14';
var map;
var markers = [];
var mapCenter = {lat: -37.8203576, lng: 144.9516255}; // Melbourne, Australia
var infowindow;



function initGoogleMap() {
  infowindow = new google.maps.InfoWindow({
  });

  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 11,
  center: mapCenter
  });

  var neighborhood = ['456 High St, Preston VIC 3072',
                          '80 Cochranes Rd, Moorabbin VIC 3189',
                          '35 Ebden St, Moorabbin VIC 3189',
                          '87 Kingsway, Glen Waverley VIC 3150',
                          '88 Kingsway, Glen Waverley VIC 3150',
                          '25/27 Portman St, Oakleigh VIC 3166',
                          '402 Chapel St, South Yarra VIC 3141',
                          '413 Brunswick St, Fitzroy VIC 3065'];

  for (var i = 0; i < neighborhood.length; i++) {
    addMarkerToGoogleMap(neighborhood[i], false);
  }
}



function closeInfoWindow(marker) {
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

  marker.addListener('click', openInfoWindowByMarker.bind(null, marker), false);
  markers.push(marker);
  return marker;
}



function toggleMarker(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
    map.setZoom(11);
    map.setCenter(mapCenter);
  }
  else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    google.maps.event.addListener(infowindow,'closeclick', closeInfoWindow.bind(null, marker), false);
    infowindow.open(map, marker);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
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



function reverseGeolocation(marker) {
  var geocoder = new google.maps.Geocoder;
  var address;
  var latlng = marker.position;

  geocoder.geocode({
    latLng: latlng
  }, function(responses) {
    if (responses && responses.length > 0) {
      address = responses[0].formatted_address;
      openInfoWindowByAddress(address);
    }
  });
}



function openInfoWindowByMarker(marker) {
  reverseGeolocation(marker);
}



function openInfoWindowByAddress(address) {
  infowindow.setContent('');
  clearMarkers();
  getYelpInformationByLocation(address);
  addMarkerToGoogleMap(address, true);
}