Project
-------
Neighbourhood Map

Description
-----------
This is a web site which allows users to navigate to some of the favourite places I like to eat.
It uses Google Maps to display the map information and Yelp to gather more information about the location, such as rating, phone number etc.

The design implements a responsive UI to work well on multiple devices.

The Yelp Search API (v2) is used to fetch detailed information. The endpoint used is;

https://api.yelp.com/v2/search?

The "location" attribute is set by the address specified. E.g.

https://api.yelp.com/v2/search?location=80+Cochranes+Rd+Moorabbin+VIC+3189

For more information about the API please visit https://www.yelp.com/developers/documentation/v2/search_api

Installation
------------
Run the index.html file

Credits
-------
The implementation of OAuth for Yelp was referenced here;
http://stackoverflow.com/questions/13149211/yelp-api-google-app-script-oauth

It is not the recommended way of doing this as JavaScript is all client side. If the application was being hosted on a server with server side code then OAuth for Yelp would be fine and safe to do.

Author
------
Albert Spoljaric (albert.spoljaric@gmail.com)