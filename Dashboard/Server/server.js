// Node server


var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();

var webpages = "../Client/";

// static files
app.use('/', express.static(webpages, { extensions: ['html'] }));

/*
*	API Definitions
*/

app.get("/api/data/weather"); // weather forecast etc
app.get("/api/data/weather"); // temperature details - change to post to query location?
app.post("/api/data/custom"); // custom json to be ran from this server and return variables they want back
// example JSON object sent ot a /api/data/custom
/*
	custom = {
		jsonUrl : eg https://query.yahooapis.com/v1/public/yql?q=select..... etc
		keysWanted = [list of keys returned from the specific] in order to be returned
	}

*/
// the server will then perform the query and then parse the output and pick the keys from the requested keys array
/*
	customReturn = {
		meta : [some info like date/time of update]
		key : value - all from the request keys
	}

*/ 



app.listen(8080);
