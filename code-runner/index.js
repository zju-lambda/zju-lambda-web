var https = require('https');

//create a server object:
// http.createServer(function (req, res) {

//   res.write('Hello World!'); // write a response to the client
//   res.end(); // end the response
// }).listen(3141); // the server object listens on port 3141 

var token = 'ab4ee798-9a1a-4f86-993e-20c81cfd5857';

var options = {
    hostname: 'run.glot.io',
    path: '/languages/python/latest',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
    }
};

var data = {
    "files": [
        {
            "name": "main.py",
            "content": "print(42)"
        }
    ]
};

var req = https.request(options, function (res) {
    var status = res.statusCode;
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(chunk);
    });
});

req.write(JSON.stringify(data));

req.end();