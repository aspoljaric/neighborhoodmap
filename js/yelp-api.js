var yelpAPIUrl = 'https://api.yelp.com/v2/search';
//OAuth
var consumerKey = 'Uo8bOhOfJa2yS6l9OXTK2g';
var consumerSecret = 'l7oTgSDqO6FW_ohzYk-biY1SCV4';
var accessToken = '7lZkN-Wjx3XAuV9N2f9EvuQPjzIATCpA';
var accessTokenSecret = 'zfsg8-Dwu2K6UN1QpyjlSfUdDnI';


function getYelpInformationByLocation(location) {
// Please note there is no secure way of doing this via JavaScript as this is all
// client side. This OAuth implementation can not be used for production (secret keys are
// exposed publicly). It is only meant to demonstrate the API usage for this application.
  var auth = {
    consumerKey : consumerKey,
    consumerSecret : consumerSecret,
    accessToken : accessToken,
    accessTokenSecret : accessTokenSecret,
    serviceProvider : {
      signatureMethod : "HMAC-SHA1"
      }
    };

  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };

  var parameters = [];
  parameters.push(['location', location]);
  parameters.push(['radius_filter', 20]);
  parameters.push(['callback', 'callback']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action' : yelpAPIUrl,
    'method' : 'GET',
    'parameters' : parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);

  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'dataType' : 'jsonp',
    'cache': true
    }).done(function(data, textStatus, jqXHR) {
      if(data !== undefined) {
        var businessName = "Yelp Search: " + data.businesses[0].name;
        var phoneNumber = data.businesses[0].phone;
        var ratingImg = data.businesses[0].rating_img_url;
        var imgUrl = data.businesses[0].image_url;
        var snippetText = data.businesses[0].snippet_text;
        var mobileURL = data.businesses[0].mobile_url;
        setYelpInformation(businessName, phoneNumber, ratingImg, imgUrl, snippetText, mobileURL);
    }
    else {
      setAPIFailMessage("No Yelp information for this location.");
    }
    }).fail(function() {
      setAPIFailMessage("Unable to connect to Yelp.");
  });
}


function setYelpInformation(businessName, phoneNumber, ratingImg, imgUrl, snippetText, mobileURL) {
  populateInfoWindowContent(businessName, phoneNumber, ratingImg, imgUrl, snippetText, mobileURL);
}