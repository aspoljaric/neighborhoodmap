var googleMapsAPIUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
var googleMapsAPIKey = 'AIzaSyAbmfw7OfezCJs7qpCOQQZ7IB46SKTQZ14';
var map, infowindow;
var markers = [];
var mapCenter = {lat: -37.8203576, lng: 144.9516255}; // Melbourne, Australia


function initGoogleMap() {
  infowindow = new google.maps.InfoWindow({
  });

  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 11,
  center: mapCenter
  });

  ko.applyBindings(new ViewModel());
}


function centreMap() {
  if(map !== undefined) {
    map.setZoom(11);
    map.setCenter(mapCenter);
  }
}


function clearMarkers() {
  var markersCount = markers.length;
  for (var i = 0; i < markersCount; i++) {
    markers[i].setVisible (false);
  }
}


function reverseGeolocation(marker, processesGeolocation) {
  var geocoder = new google.maps.Geocoder();
  var latlng = marker.position;
  geocoder.geocode({
    latLng: latlng
    }, function(responses, status) {
      if (status === 'OK') {
        processesGeolocation(responses);
      }
      else {
        setAPIFailMessage("Unable to connect to Google Maps.");
      }
    });
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
  if(marker !== undefined) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
      map.setZoom(11);
      map.setCenter(mapCenter);
    }
    else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 2800);
      google.maps.event.addListener(infowindow,'closeclick', closeInfoWindow.bind(null), false);
      map.setZoom(15);
      map.setCenter(marker.getPosition());
    }
  }
}


function addMarkerToGoogleMap(address, isToggle, processMarkerData) {
  var url = googleMapsAPIUrl + 'address=' + address + '&key=' + googleMapsAPIKey;

  $.getJSON(url)
    .done(function(data) {
        processMarkerData(data, isToggle);
    })
    .fail(function(){
         setAPIFailMessage("Unable to connect to Google Maps.");
    });
}


function processMarkerData(data, isToggle){
  var lat = data.results[0].geometry.location.lat;
  var lng = data.results[0].geometry.location.lng;
  myLatLng = {lat: lat, lng: lng};
  var marker;

  if(myLatLng !== undefined) {
    marker = createMarkerByGeoCoordinates(myLatLng);
    if(isToggle === true) {
      marker.animation = null;
      toggleMarker(marker);
    }

  }
  return marker;
}


function populateInfoWindowContent(businessName, phoneNumber, ratingImg, imgUrl, snippetText, mobileURL) {
  var contentString = '<div id="infobox-content">'+
      '<h4>' + businessName + '</h4>'+
      '<div id="infobox-body-content">'+

      '<div id="infobox-image">' +
      '<img src=' + imgUrl + '>' +
      '</div>'+

      '<div id="infobox-contact">' +
      '<b>Phone:</b>' + phoneNumber + '<br>' +
      '<b>Rating:</b> <img src=' + ratingImg + ' alt="Rating"> <br><br>' +
      '</div>' +

      '<div id="infobox-review">' +
      '<b>Latest Review:</b> <i>' + snippetText + '</i>' +
      '<a href='+ mobileURL + ' target="_blank">More information.</a>' +
      '</div>' +

      '</div>'+
      '</div>';

  infowindow.setContent(contentString);
}


function openInfoWindowByMarker(marker) {
  infowindow.setContent('');
  toggleMarker(marker);
  var formattedAddress;
  reverseGeolocation(marker,function(address){
     formattedAddress = address[0].formatted_address;
     populateInfoWindowFromYelp(formattedAddress);
     infowindow.open(map, marker);
  });
}


function openInfoWindowByAddress(address) {
  infowindow.setContent('');
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
  infowindow.open(map, marker);
}


function closeInfoWindow() {
  map.setZoom(11);
  map.setCenter(mapCenter);
}


function populateInfoWindowFromYelp(address) {
  getYelpInformationByLocation(address);
}