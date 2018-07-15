var https = require('https');
var http = require('http');

var token = 'ab4ee798-9a1a-4f86-993e-20c81cfd5857';

var glot_langs = [
  'c', 'cpp', 'python', 'haskell', 'rust', 'scala', 'javascript', 'lua',
  'idris', 'java'
];
var glot_ext = [
  '.c', 'cpp', '.py', '.hs', '.rst', '.scala', '.js', '.lua', '.idr', '.java'
];

function runcode(lang, content, callback) {
  var use_glot = false;
  for (var i in glot_langs) {
    if (lang == glot_langs[i]) {
      use_glot = true;
      var options = {
        hostname: 'run.glot.io',
        path: '/languages/' + lang + '/latest',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        }
      };

      var data = {
        'files': [{'name': 'main' + glot_ext[i], 'content': content}]
      };

      var req = https.request(options, function(res) {
        var status = res.statusCode;
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          var data = JSON.parse(chunk);
          if (data.stdout) {
            callback(data.stdout);
          } else if (data.stderr) {
            callback(data.stderr);
          } else {
            callback(data.error);
          }
        });
      });

      req.write(JSON.stringify(data));
      req.end();
      break;
    }
  }

  if (!use_glot) {
    callback();
  }
}

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(body);
    });
  }
}).listen(4368);

runcode('python', 'print(42)', console.log);