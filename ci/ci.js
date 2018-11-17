const http = require('http');
const https = require('https');
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
      var msg = 'forward';
      if (data && data.head_commit && data.head_commit.message) {
        msg = data.head_commit.message.trim();
      }
      var branch = [];
      var s = msg.split(' ')
      if (data.repository && data.repository.name &&
          data.repository.name == 'arcdb') {
        if (s.length == 2 && s[0] == 'branch') {
          branch = ['cd arcdb', 'git checkout ' + s[1], 'cd ../'];
        }
        var cmds =
            [
              'rm -rf engine arcdb',
              'git clone git@git.dev.tencent.com:Nicekingwei/arcdb.git'
            ].concat(branch)
                .concat([
                  'git clone git@code.aliyun.com:nicekingwei/engine.git',
                  'rm -rf engine/engine_race/*.h',
                  'rm -rf engine/engine_race/*.cc',
                  'cp -r arcdb/engine_race/include/* engine/engine_race',
                  'cp -r arcdb/engine_race/src/* engine/engine_race',
                  'cd engine', 'cp -r include/ engine_race/', 'git add .',
                  'git commit -m "' + msg + '"', 'git push', 'cd ../',
                  'rm -rf engine arcdb'
                ]);
        var cmd = cmds.join(' && ');
        console.log(cmd);
        cp.exec(cmd, console.log);
      }
      else if (
          data.repository && data.repository.name &&
          data.repository.name == 'bootdb') {
        if (s.length == 2 && s[0] == 'branch') {
          branch = ['cd bootdb', 'git checkout ' + s[1], 'cd ../'];
        }
        var committer = 'who';
        if (data && data.head_commit && data.head_commit.committer) {
          committer = data.head_commit.committer.name;
        }
        console.log(data);
        var cmds =
            [
              'rm -rf engine bootdb',
              'git clone git@git.dev.tencent.com:Nicekingwei/bootdb.git'
            ].concat(branch)
                .concat([
                  'git clone git@code.aliyun.com:nicekingwei/engine.git',
                  'rm -rf engine/engine_race/*.h',
                  'rm -rf engine/engine_race/*.cc',
                  'cp -r bootdb/engine_race/include/* engine/engine_race',
                  'cp -r bootdb/engine_race/src/* engine/engine_race',
                  'cd engine', 'cp -r include/ engine_race/', 'git add .',
                  'git commit -m "' + msg + '"', 'git push', 'cd ../',
                  'rm -rf engine bootdb'
                ]);
        var cmd = cmds.join(' && ');
        console.log(cmd);
        cp.exec(cmd, function(err) {
          if (err) {
            console.log(err);
          }
          var options = {
            hostname: 'oapi.dingtalk.com',
            port: 443,
            path:
                '/robot/send?access_token=150fad29d24a78689a26610b3c824c2c30e8fff8aa9677a8d9a77bcf8b3f92d4',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
          };
          var postData = {
            'msgtype': 'text',
            'text': {'content': committer + ':' + msg}
          };
          var req = https.request(options);
          req.write(JSON.stringify(postData));
          req.end();
        });
      }
      res.writeHead(200);
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}
http.createServer(server).listen(7877);