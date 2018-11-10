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
      if (data.repository && data.repository.name &&
          data.repository.name == 'arcdb') {
        var cmds = [
          'rm -rf engine arcdb',
          'git clone git@git.dev.tencent.com:Nicekingwei/arcdb.git',
          'git clone git@code.aliyun.com:nicekingwei/engine.git',
          'rm -rf engine/engine_race/*.h',
          'rm -rf engine/engine_race/*.cc',
          'cp -r arcdb/engine_race/include/* engine/engine_race',
          'cp -r arcdb/engine_race/src/* engine/engine_race',
          'cd engine',
          'git add .',
          'git commit -m "forward"',
          'git push',
          'cd ../',
          'rm -rf engine arcdb'
        ];
        var cmd = cmds.join(' && ');
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