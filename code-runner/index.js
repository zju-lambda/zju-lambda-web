const https = require('https');
const http = require('http');
const fs = require('fs');
const cp = require('child_process');

/*
 * code runner
 */
var token = 'ab4ee798-9a1a-4f86-993e-20c81cfd5857';

var glot_langs = {
  'c': '.c',
  'cpp': '.cpp',
  'python': '.py',
  'haskell': '.hs',
  'rust': '.rst',
  'scala': '.scala',
  'javascript': '.js',
  'lua': '.lua',
  'idris': '.idr',
  'java': '.java'
};

var my_langs = {
  'steak': {
    ext: '.stk.cpp',
    docker: 'nicekingwei/steak',
    cmd: function() {
      return 'steak . && g++ -std=c++17 main.cpp && ./a.out';
    }
  },
  'coq': {
    ext: '.v',
    docker: 'skippa/coq',
    cmd: function(filename) {
      return 'coqc main.v';
    }
  },
  'agda': {
    ext: '.agda',
    docker: 'banacorn/agda',
    cmd: function(filename) {
      var head = 'module main where\n';
      var main_code = fs.readFileSync(filename, 'utf8');
      fs.writeFileSync(filename, head + main_code);
      return 'agda main.agda';
    }
  }
};


function runcode(lang, content, callback) {
  // glot runner
  var lang_setting = glot_langs[lang];

  if (lang_setting) {
    var options = {
      hostname: 'run.glot.io',
      path: '/languages/' + lang + '/latest',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    };

    var data = {'files': [{'name': 'main' + lang_setting, 'content': content}]};

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
  } else {
    lang_setting = my_langs[lang];
    if (lang_setting) {
      var rand = Math.floor(Math.random() * 1e9).toString();
      cp.execSync('mkdir -p ' + rand);
      var filename = rand + '/main' + lang_setting.ext;
      fs.writeFileSync(filename, content);

      var cmd = 'docker run -v /home/ubuntu/code/' + rand +
          ':/tmp/code -w /tmp/code ' + lang_setting.docker + ' ' +
          lang_setting.cmd();

      cp.exec(cmd, function(err, stdout, stderr) {
        if (stdout) {
          callback(stdout);
        } else if (stderr) {
          callback(stderr);
        } else {
          callback(err);
        }
      });
    } else {
      callback();
    }
  }
}


function server(req, res) {
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      var data = JSON.parse(body);
      res.writeHead(201, {'Content-Type': 'text/html'});
      runcode(data.lang, data.code, function(result) {
        res.write(result);
        res.end();
      });
    });
  }
}
http.createServer(server).listen(4368);