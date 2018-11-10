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
      var msg = data.head_commit.message.trim()
      var branch = [];
      var s = msg.split(' ')
      if (s.length == 2 && s[0] == 'branch') {
        branch = ['cd arcdb', 'git checkout ' + s[1], 'cd ../'];
      }
      if (data.repository && data.repository.name &&
          data.repository.name == 'arcdb') {
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
                  'cd engine', 'git add .', 'git commit -m "forward"',
                  'git push', 'cd ../', 'rm -rf engine arcdb'
                ]);
        var cmd = cmds.join(' && ');
        console.log(cmd);
        cp.execSync(cmd);
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