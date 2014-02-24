var http = require('http');  // Provides HTTP server and client functinality
var fs = require('fs');      // Provides access to file system related funct
var path = require('path');  // Provides fs path type funct
var mime = require('mime');  // provides ability to derive MIME types based on file ext
var cache = {};              // Object where contents of cached files are stored.
var port = 2943;


var events = require('events').EventEmitter; // Provides access to event emitter library functionality
// Exports common event listener
module.exports = new events();


// Import functions from example.js, notably async
var async = require('./js/example.js');
var maj = require('./controllers/majChordController.js');

function serveStatic (response, cache, absPath) {
	// If the path for file to be sent already was in cache, use that path
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	// Otherwise must do a lot of work
	} else {
		// Use fs functionality to check if the path arg exists
		fs.exists(absPath, function(exists) {
			// use the results of the fs.exists (stored in param exists) to do logic
			if(exists) {
				// it exists and must be read in
				fs.readFile(absPath, function(err, data) {
					// should be noted the callback param data is the data read from path
					if(err) {
						send404(response);
					} else {
						// no error, store path as array index and data
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

var server2 = http.createServer(function (req, res) {
	if(req.url == '/a_maj') {
		if(maj.lookup('a')) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end();
		} else {
			res.writeHead(500, {'Content-Type': 'text/html'});
			res.end();
		}
	} else if(req.url == '/') {
		console.log('Hello');
	} else if(req.url == '/d_min') {
		fs.readFile('./chord_list.json', function(err, data) {
			if(err) throw err;
			var notes = JSON.parse(data.toString());
			console.log(notes.min.d);
			console.log(notes);

			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end();
		})
	}
}).listen(1200, function() {
	console.log('Listening on port 1200');
	// Imported functions from async object called using dot notation
	// Parameters are functions to be executed
	async.asyncFunction(
		function() { console.log("Fail")},
		function() { console.log("Success")}
	);
});

// Generic error handler for servers
module.exports.on('err', function(err) {
	console.log('ERROR: ' + err);
});

var server1 = http.createServer(function (request, response) {
	var filePath = false;

	if(request.url == '/') {
		filePath = 'public/index.html'
	} else {
		filePath = 'public' + request.url;
	}

	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});

server1.listen(port+1, function() {
	console.log("Server1 listening on " + (port+1) + ".");
})