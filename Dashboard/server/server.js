// Node server


var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var webpages = '../client/';

// static files
app.use('/', express.static(webpages, {
  extensions: ['html']
}));

// parse application/json required from express 4.x onwards see - http://stackoverflow.com/questions/9177049/express-js-req-body-undefined
app.use(bodyParser.json());

/*
 *	API Definitions
 */

app.get('/api/data/weather'); // weather forecast etc
app.get('/api/data/temperature'); // temperature details - location in query

app.get('/api/data/custom/test', customTest); // perform the custom service request and return the data to the user
app.post('/api/data/custom/json', serviceJsonWidget); // custom json to be ran from this server and return variables they want back
app.post('/api/data/custom/rss'); // custom rss widget, convert to json then just pass to the json function

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

function serviceJsonWidget(req, res) {
  var updateRequest = req.body;
  if (!updateRequest) return;

  var values = [];

  request(updateRequest.serviceURL, function(error, response, body) {
    if (error) res.send(404);
    if (body) {
      var serviceData = JSON.parse(body);
      for (var i = 0; i < updateRequest.jsonKeys.length; i++) {
        var value = updateRequest.jsonKeys[i].split('.').reduce((a, b) => (a != undefined) ? a[b] : a, serviceData); // see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
        // var value = updateRequest.jsonKeys[i].split('.').reduce(function(a, b) {
        //   return (a != undefined) ? a[b] : a;
        // }, serviceData);

        if (!value) value = 'KEY_NOT_FOUND';

        var toReturn = {
          key : updateRequest.jsonKeys[i],
          value : value
        };
        values.push(toReturn);
      }
      console.log(values);
      res.send(JSON.stringify(values));
    }
  });

}


function customTest(req, res) {
  var urlService = req.query.url;

  request(urlService, function(error, response, body) {
    if (body) {
      res.send(body);
    } else {
      res.sendStatus(404); // could not connect to service
    }
  });

}


app.listen(8080);
