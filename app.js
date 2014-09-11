var express = require('express'),
    fs = require('fs');
var app = express();

function docPath(req, addPath, ending) {
  return __dirname + '/public/' + addPath + '/' + req.params.doc + '.' + ending;
}

function sendFile(req, res, addPath, ending) {
  res.sendFile(docPath(req, addPath, ending));
}

function writeFile(req, res, addPath, ending) {
  var doc = '';
  req.on('data', function(data) { doc += data; });
  req.on('end', function() {
    var path = docPath(req, addPath, ending);
    fs.writeFile(path, doc, function() { res.end(); });
  });
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

var exampleFileRoutes = {
  'treebanks': 'xml',
  'translations': 'json'
};

function get(route, fileType) {
  return function(req, res) { sendFile(req, res, route, fileType); };
}

function post(route, fileType) {
  return function(req, res) { writeFile(req, res, route, fileType); };
}

for (var route in exampleFileRoutes) {
  var fileType = exampleFileRoutes[route];
  app.get( '/examples/' + route + '/:doc', get(route, fileType));
  app.post('/examples/' + route + '/:doc', post(route, fileType));
}


var port = process.argv[2] || 8082;
var server = app.listen(port, function() {
  console.log('arethusa-server listening on port %d...', server.address().port);
});
