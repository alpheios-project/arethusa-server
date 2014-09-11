var express = require('express'),
    fs = require('fs');
var app = express();

var options = {
  root: __dirname + '/public/'
};

function docPath(req, addPath, ending) {
  return addPath + '/' + req.params.doc + '.' + ending;
}

function sendFile(req, res, addPath, ending) {
  res.sendFile(docPath(req, addPath, ending), options);
}

function writeFile(req, res, addPath, ending) {
  var doc = '';
  req.on('data', function(data) { doc += data; });
  req.on('end', function() {
    var path = __dirname + '/public/' + docPath(req, addPath, ending);
    fs.writeFile(path, doc, function() { res.end(); });
  });
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/examples/treebanks/:doc', function(req, res) {
  sendFile(req, res, 'treebanks', 'xml');
});

app.post('/examples/treebanks/:doc', function(req, res) {
  writeFile(req, res, 'treebanks', 'xml');
});

app.get('/examples/translations/:doc', function(req, res) {
  sendFile(req, res, 'translations', 'json');
});

app.post('/examples/translations/:doc', function(req, res) {
  writeFile(req, res, 'translations', 'json');
});


var port = process.argv[2] || 8082;
var server = app.listen(port, function() {
  console.log('arethusa-server listening on port %d...', server.address().port);
});
