// Node server


var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler')
var app = express();
//var Feed = require('rss-to-json'); //var FeedMe = require('feedme');
var parser = require('rss-parser');
var crypto = require("crypto");

var webpages = '../client/';
var widgetFolder = 'widgets/';
var layoutFolder = 'layouts/';

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

// app.get('/api/account/widgets/stored/get', getWidget); // gets a widget, takes parameter of filename (or id if we have time to set up database)
// app.get('/api/account/widgets/stored/list', listWidgets); //lists all widgets
app.post('/api/account/widgets/stored/save', saveWidget);
app.get('/api/account/widgets/stored/list/content', listWidgetsWithContent); 

app.post('/api/account/layouts/stored/save', saveLayout);
app.get('/api/account/layouts/stored/list', listLayouts);
app.get('/api/account/layouts/stored/get', getLayout);

function getLayout(req, res){
  var name = req.query.name;
  if(!name) return;

  Promise.resolve(getData(layoutFolder + name,{encoding: 'utf-8'}))
  .then((data) => {
    console.log('Found layout with id : ' + data.name)
    res.json(data);
  }).catch((e) => {
    console.log(e)
    res.sendStatus(404);
  });

}


function saveLayout(req, res){ 
  // var filename = req.query.file;
  var layoutContent = req.body;
  if(!layoutContent) return; // chnage so if no filename set it to random one
  layoutContent = JSON.stringify(layoutContent);

  var filename = crypto.randomBytes(20).toString('hex'); // create random name

  fs.writeFile('layouts/' + filename, layoutContent, {encoding: 'utf-8'}, function(err){
    if (!err){
      res.sendStatus(200);
    }else{
      console.log(err);
      res.sendStatus(404);
    }
    console.log(filename + " layout saved successfully!");
  });
}

function listLayouts(req, res){
  var promises = [];
  fs.readdir(layoutFolder, (err, files) => {
    
    for(var i=0; i<files.length; i++){
      promises.push(getData(layoutFolder + files[i], {encoding: 'utf-8'}));
    }

    Promise.all(promises)
      .then((data) => {
        if(data.length !== 0){
          var list = [];
          for(layout of data){
            list.push({
              id : layout.name,
              name : layout.data.name,
              description : layout.data.description
            });
          }
          res.json(list);
        } else {
          res.sendStatus(404);
        }
      })
      .catch((e) => console.log(e));
  });
}

function saveWidget(req, res){ 
  // var filename = req.query.file;
  var widgetContent = req.body;
  if(!widgetContent) return; // chnage so if no filename set it to random one
  widgetContent = JSON.stringify(widgetContent);

  var filename = crypto.randomBytes(20).toString('hex'); // create random name

  fs.writeFile('widgets/' + filename, widgetContent, {encoding: 'utf-8'}, function(err){
    if (!err){
      res.sendStatus(200);
    }else{
      console.log(err);
      res.sendStatus(404);
    }
    console.log(filename + " widget saved successfully!");
  });
}

function listWidgetsWithContent(req, res){
  var pageNumber = req.query.p;
  var searchTerm = req.query.search;

  var promises = [];
  fs.readdir(widgetFolder, (err, files) => {
    
    for(var i=0; i<files.length; i++){
      promises.push(getData(widgetFolder + files[i], {encoding: 'utf-8'}));
    }

    Promise.all(promises)
      .then((data) => {
        if(data.length !== 0){
          if(pageNumber){ 
            var lowerBound = (pageNumber - 1) * 9; // find the lower bound i.e page 1, the lower bound is 0
            var selection = data.slice(lowerBound, lowerBound + 9);
            //res.json(selection).sendStatus();
            res.status((data[lowerBound + 9] == undefined) || (selection < 9) ? 301 : 200).json(selection)
          } else if(searchTerm){
            var searchResults = [];
            for(var widgetRaw of data){
              if(widgetRaw.data.name.toLowerCase().includes(searchTerm)){
                searchResults.push(widgetRaw);
              }
            }
            res.json(searchResults);
          } else {
            console.log("Tried to send every single widget this should not happen.");
            //res.json(data);
          }
        } else {
          res.sendStatus(404);
        }

      })
      .catch((e) => console.log(e));

    

  });
   
}

function getData(fileName, type) {
  return new Promise(function(resolve, reject){
    fs.readFile(fileName, type, (err, data) => {
        if (err) { reject(err); console.log(err); }
        resolve({ 
          name : path.basename(fileName),
          data : JSON.parse(data)
        });
    })
  });
}


// function getWidget(req, res){
//   var filename = req.query.file;

//   if(!filename) return;

//   fs.readFile('widgets/' + filename, {encoding: 'utf-8'}, function(err,data){
//     if (!err){
//       res.send(JSON.parse(data));
//     }else{
//       console.log(err);
//       res.sendStatus(404);
//     }
//   });
// }


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

  console.log();
  console.log("New Update request for the URL : ", updateRequest.serviceURL);
  console.log("Looking for the following json keys : " , updateRequest.jsonKeys);
  console.log();

  if(type == "JSON"){
    request(updateRequest.serviceURL, function(error, response, body) {
      if (error) {
        console.log(error);
      }
      if(isJSON(body)){
          var serviceData = JSON.parse(body);
          var values = parseData(serviceData, updateRequest);
          res.send(JSON.stringify(values));
      } else {
        res.sendStatus(400); // bad request
      }
    });
  } else if(type == "RSS"){
    parser.parseURL(updateRequest.serviceURL, function(err, parsed) {
      if (err) {
        res.sendStatus(400); // bad request
        return;
      }
      if(parsed){
        var serviceData = parsed;
        var values = parseData(serviceData, updateRequest);
        res.send(JSON.stringify(values));
      } else {
        res.sendStatus(404); // data not found
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
      if(error){
        console.log(error);
      }
      if (body) {
        if(isJSON(body)){
          res.send(body);
        } else {
          res.sendStatus(400); // bad request
        }
      } else {
        res.sendStatus(404); // could not connect to service
      }
    });
  } else if(type == "RSS"){
    parser.parseURL(urlService, function(err, parsed) {
      if (err) {
        res.sendStatus(400); // bad request
        return;
      }
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

// function listWidgets(req, res){
//   filenameArray = [];
//   fs.readdir(widgetFolder, (err, files) => {
//     files.forEach(file => {
//       filenameArray.push(file);
//     });

//     if(filenameArray.length !== 0){
//       res.json(filenameArray);
//     } else {
//       res.sendStatus(404);
//     }

//   });
// }

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


app.listen(8080);
