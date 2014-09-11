var express = require('express');
var app = express();

var options = {
  root: __dirname + '/public/'
};

function sendFile(req, res, addPath, ending) {
  res.sendFile(addPath + '/' + req.params.doc + '.' + ending, options);
}

app.get('/examples/treebanks/:doc', function(req, res) {
  sendFile(req, res, 'treebanks', 'xml');
});

app.get('/examples/translations/:doc', function(req, res) {
  sendFile(req, res, 'translations', 'json');
});


var server = app.listen(8083, function() {
  console.log('arethusa-server listening on port %d...', server.address().port);
});