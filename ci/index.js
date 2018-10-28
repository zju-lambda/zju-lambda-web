const http = require('http');
const fs = require('fs');
const cp = require('child_process');

function server(req, res) {
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      var data = JSON.parse(body);
      console.log(data);
      res.writeHead(200).end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}
http.createServer(server).listen(7876);