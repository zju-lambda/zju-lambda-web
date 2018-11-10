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
      return 'steak . && g++ -std=c++17 ./main.cpp && ./a.out';
    }
  },
  'cpp':{
    ext: '.cpp',
    docker: 'nicekingwei/steak',
    cmd: function() {
      return 'g++ -std=c++17 ./main.cpp && ./a.out';
    }
  },
  'coq': {
    ext: '.v',
    docker: 'skippa/coq',
    cmd: function() {
      return 'coqc main.v';
    }
  },
  'racket': {
    ext: '.rt',
    docker: 'jackfirth/racket',
    cmd: function() {
      return 'racket main.rt';
    }
  },
  'agda': {
    ext: '.agda',
    docker: 'banacorn/agda',
    cmd: function(filename) {
      var head = 'module main where\n';
      var main_code = fs.readFileSync(filename, 'utf8');
      fs.writeFileSync(filename, head + main_code, {encoding: 'utf-8'});
      return 'agda main.agda';
    }
  }
};


var docker_count = 0;
var docker_max = 10;
var docker_garbages = [];
function docker_remove(name){
  docker_count += 1;
  docker_garbages.push(name);
  if(docker_count>docker_max){
    docker_count = 0;
    var cmd = 'docker rm ' + docker_garbages.join(' ');
    docker_garbages = [];
    cp.exec(cmd);
  }
}

function runcode(lang, content, callback) {
  // glot runner
  var lang_setting = glot_langs[lang];
  content = new Buffer(content, 'base64').toString('utf-8');
  console.log('['+lang+'] '+content.split('\n').slice(0,3).join(' '));

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
      var rand = Math.abs(Math.floor(Math.random() * 1e9)).toString();
      cp.execSync('mkdir -p /home/ubuntu/code/' + rand);
      var filename = '/home/ubuntu/code/' + rand + '/main' + lang_setting.ext;
      fs.writeFileSync(filename, content, {encoding: 'utf-8'});

      var cmd = 'docker run -v /home/ubuntu/code/' + rand +
          ':/tmp/code -w /tmp/code ' + lang_setting.docker + ' /bin/bash -c "' +
          lang_setting.cmd(filename) + '"';

      cp.exec(cmd, function(err, stdout, stderr) {
        if (stdout) {
          callback(stdout);
        } else if (stderr) {
          callback(stderr);
        } else {
          callback(err);
        }
        cp.exec('rm -rf ' + rand);
        docker_remove(rand);
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
        if (result) {
          var nr = result.replace('\n','<br>');
          while(nr!=result){
            result = nr;
            nr = result.replace('\n','<br>');
          }
          console.log("[result] "+result);
          res.write(result);
        } else {
          res.writeHead(403);
        }
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}
http.createServer(server).listen(4368);