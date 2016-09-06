var googleMapsAPIUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
var googleMapsAPIKey = 'AIzaSyAbmfw7OfezCJs7qpCOQQZ7IB46SKTQZ14';
var map;
var markers = [];
var mapCenter = {lat: -37.8203576, lng: 144.9516255}; // Melbourne, Australia
var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Name</h1>'+
      '<div id="bodyContent">'+
      'MY TEXT' +
      '</div>'+
      '</div>';
var infowindow;



function initGoogleMap() {
  infowindow = new google.maps.InfoWindow({
  content: contentString
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
                          '17-21 Eaton Mall, Oakleigh VIC 3166',
                          '2/402 Chapel St, South Yarra VIC 3141',
                          'Crown Towers Melbourne, Crown Casino, 8 Whiteman St, Southbank VIC 3006'];

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

  marker.addListener('click', toggleMarker.bind(null, marker), false);
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

  if(!isToggle) {
    $.getJSON(url)
      .done(function(data) {
        processMyJson(data);
      })
      .fail(function(){
         setAPIFailMessage("Unable to connect to Google.");
     });
    }
  else {
    $.getJSON(url)
      .done(function(data) {
        processMyJsonToggle(data);
      })
      .fail(function(){
         setAPIFailMessage("Unable to connect to Google.");
     });
    }
}



function processMyJson(data){
  var lat = data.results[0].geometry.location.lat;
  var lng = data.results[0].geometry.location.lng;
  myLatLng = {lat: lat, lng: lng};

  if(myLatLng != undefined) {
    var marker = createMarkerByGeoCoordinates(myLatLng);
  }
}

function processMyJsonToggle(data){
  var lat = data.results[0].geometry.location.lat;
  var lng = data.results[0].geometry.location.lng;
  myLatLng = {lat: lat, lng: lng};

  if(myLatLng != undefined) {
    var marker = createMarkerByGeoCoordinates(myLatLng);
    marker.animation = null;
    toggleMarker(marker);
  }
}


