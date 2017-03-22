// Node server


var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler')
var app = express();
//var Feed = require('rss-to-json'); //var FeedMe = require('feedme');
var parser = require('rss-parser');

var webpages = '../client/';
var widgetFolder = 'widgets/';

// static files
app.use('/', express.static(webpages, {
  extensions: ['html']
}));

// parse application/json required from express 4.x onwards see - http://stackoverflow.com/questions/9177049/express-js-req-body-undefined
app.use(bodyParser.json());
app.use(errorhandler());
/*
 *	API Definitions
 */

app.get('/api/data/weather'); // weather forecast etc
app.get('/api/data/temperature'); // temperature details - location in query

app.get('/api/data/custom/test', customTest); // perform the custom service request and return the data to the user
app.post('/api/data/custom/service', serviceWidget); // custom json to be ran from this server and return variables they want back
//app.post('/api/data/custom/rss'); // custom rss widget, convert to json then just pass to the json function

//app.post('/api/account/create', createAccount);
//app.post('/api/account/login', login);
app.get('/api/account/widgets/stored/get', getWidgetJSON); // gets a widget, takes parameter of filename (or id if we have time to set up database)
app.get('/api/account/widgets/stored/list', listWidgets); //lists all widgets

function getWidgetJSON(req, res){
  var filename = req.query.file;

  if(!filename) return;

  fs.readFile('widgets/' + filename, {encoding: 'utf-8'}, function(err,data){
    if (!err){
      res.send(JSON.parse(data));
    }else{
      console.log(err);
      res.sendStatus(404);
    }

  });
}

function listWidgets(req, res){
  filenameArray = [];
  fs.readdir(widgetFolder, (err, files) => {
    files.forEach(file => {
      filenameArray.push(file);
    });

    if(filenameArray.length !== 0){
      res.json(filenameArray);
    } else {
      res.sendStatus(404);
    }

  });
}


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

function serviceWidget(req, res) {
  var updateRequest = req.body;
  var type = req.query.type; // json native or rss
  if (!updateRequest) return;

  console.log("New Update request for the URL : "+ updateRequest.serviceURL);
  console.log(updateRequest);

  if(type == "JSON"){
    request(updateRequest.serviceURL, function(error, response, body) {
      if (error) res.sendStatus(404);
      if (body) {
        var serviceData = JSON.parse(body);
        var values = parseData(serviceData, updateRequest);
        console.log(values);
        res.send(JSON.stringify(values));
      } else {
        res.sendStatus(404);
      }
    });
  } else if(type == "RSS"){
    parser.parseURL(updateRequest.serviceURL, function(err, parsed) {
      if (err) res.sendStatus(404);
      if(parsed){
        var serviceData = parsed;
        var values = parseData(serviceData, updateRequest);
        console.log(values);
        res.send(JSON.stringify(values));
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    console.log("No type specified!");
  }

}

function parseData(bodyObject, requestedKeysObject){
  var values = [];
  for (var i = 0; i < requestedKeysObject.jsonKeys.length; i++) {
    var value = requestedKeysObject.jsonKeys[i].split('.').reduce((a, b) => (a != undefined) ? a[b] : a, bodyObject); // see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
    
    if (!value) value = 'KEY_NOT_FOUND';

    var toReturn = {
      key : requestedKeysObject.jsonKeys[i],
      value : value
    };
    values.push(toReturn);
  }
  return values;
}


function customTest(req, res) {
  var urlService = req.query.url;
  var type = req.query.type;

  if(type == "JSON"){
    request(urlService, function(error, response, body) {
      if (body) {
        res.send(body);
      } else {
        res.sendStatus(404); // could not connect to service
      }
    });
  } else if(type == "RSS"){
    parser.parseURL(urlService, function(err, parsed) {
      if(parsed){
        res.send(parsed);
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    console.log("No type specified!");
  }

}


app.listen(8080);
