// Generic functions used by all APIs

function setAPIFailMessage(message) {
    var error = '<div id="map-error">' + message + '</div>';
    document.getElementById("map").innerHTML = error;
}