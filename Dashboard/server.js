// Node server


var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();

var webpages = __dirname + "/Client/";

// static files
app.use('/', express.static(webpages, { extensions: ['html'] }));

app.listen(8080);
