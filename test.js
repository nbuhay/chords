var http = require('http');  // Provides HTTP server and client functinality
var fs = require('fs');      // Provides access to file system related funct
var path = require('path');  // Provides fs path type funct
var mime = require('mime');  // provides ability to derive MIME types based on file ext
var cache = {};              // Object where contents of cached files are stored.
var port = 2943;
var error = require('./controllers/errorController.js');
// Import functions from example.js, notably async
var async = require('./js/example.js');
var maj = require('./controllers/majChordController.js');
var indexPath = './index.html';
var notFoundPath = './404.html';

// function serveStatic (response, cache, absPath) {
// 	// If the path for file to be sent already was in cache, use that path
// 	if (cache[absPath]) {
// 		sendFile(response, absPath, cache[absPath]);
// 	// Otherwise must do a lot of work
// 	} else {
// 		// Use fs functionality to check if the path arg exists
// 		fs.exists(absPath, function(exists) {
// 			// use the results of the fs.exists (stored in param exists) to do logic
// 			if(exists) {
// 				// it exists and must be read in
// 				fs.readFile(absPath, function(err, data) {
// 					// should be noted the callback param data is the data read from path
// 					if(err) {
// 						send404(response);
// 					} else {
// 						// no error, store path as array index and data
// 						cache[absPath] = data;
// 						sendFile(response, absPath, data);
// 					}
// 				});
// 			} else {
// 				send404(response);
// 			}
// 		});
// 	}
// }

function serveStatic(url, res) {
	fs.exists(url, function(exists) {
		if(exists) {
			fs.readFile(url, function(err, html) {
				if(err) {
					error.emit('err', err);
					res.end();
				} else {
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end(html);
				}
			});
		} else {
			fs.readFile(notFoundPath, function(err, html) {
				if(err) {
					error.emit('err', err);
					res.end();
				} else {
					error.emit('404', err);
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.end(html);
				}
			});
		}
	});
}

var server = http.createServer(function (req, res) {
	if(req.url == '/') {
		serveStatic(indexPath, res);
	} else if(req.url == '/a_maj') {
		if(maj.lookup('a')) {
			res.writeHead(200, {'Content-Type': 'text/html'});
		} else {
			res.writeHead(500, {'Content-Type': 'text/html'});
		}
		res.end();
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