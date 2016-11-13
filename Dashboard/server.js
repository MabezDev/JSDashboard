// Node server


var http = require('http');
var url = require('url');
var fs = require('fs');

var validPaths = ["/index.html","/main.css","/index.js"];
var path = "Client"


var server = http.createServer(handleRequest);
server.listen(8080);

function handleRequest(req, res){
    var parsedUrl = url.parse(req.url, true);
    console.log(req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var type = "text/plain";
    if(req.url.indexOf('.html') != -1){
        type = "text/html";
    } else if(req.url.indexOf('.js') != -1) {
        type = "text/javascript";
    } else if(req.url.indexOf('.css') != -1){
        type = "text/css";
    }
    
    fs.readFile(path + req.url, function (err, data) {
        if (err){
            handleError(res);
        } else {
            res.writeHead(200, {'Content-Type': type});
            res.write(data);
            res.end();
        }
    });
}

function handleError(response){
    response.statusCode = 404;
    response.end('Not found!\n');
}

//function validPath(str){
//    for (var elm of validPaths) {
//        if(str === elm){
//            return true;
//        }
//    }
//    return false;
//}