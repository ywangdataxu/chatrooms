var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var currency = require('./public/js/currency');

function send404(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('Error 404: resource not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {
        'Content-Type': mime.lookup(path.basename(filePath))
    });
    response.write(fileContents);
    response.end();
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        // disable cache for now cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

var server = http.createServer(function(request, response) {
    var filePath = false;
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;

    console.log('absPath = ' + absPath);
    serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log('Server listening on port 3000.');
})

var chatServer = require('./lib/chat_server');
chatServer.listen(server);


console.log(currency.USToCanadian(30));
