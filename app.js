var http = require('http');  // Provides HTTP server and client functinality
var fs = require('fs');      // Provides access to file system related funct
var path = require('path');  // Provides fs path type funct
var mime = require('mime');  // provides ability to derive MIME types based on file ext
var url = require('url');

// Express creates its own independent instance of http.createServer, neat!
var express = require('express');
var app = express();

var cache = {};              // Object where contents of cached files are stored.
var chord = require('./scripts/controllers/chordController.js');
var error = require('./scripts/controllers/errorController.js');
var indexPath = './public/index.html';
var notFoundPath = './public/404.html';
var port = 1200;
var weight = 3;

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
					res.send(500, 'Somebody poisoned the water hole!');
				} else {
					res.send(html);
				}
			});
		} else {
			fs.readFile(notFoundPath, function(err, html) {
				if(err) {
					error.emit('err', err);
					res.send(500, 'Somebody poisoned the water hole!');
				} else {
					error.emit('404', err);
					res.send(404, html);
					// res.writeHead(404, {'Content-Type': 'text/html'});
					// res.end(html);
				}
			});
		}
	});
}

app.use(express.static(__dirname + '/public'));

app.use('/', express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
// 		serveStatic(indexPath, res);
// 	});

app.listen(5000, function() {
	console.log('Express app listening on port 5000...');
});

var server = http.createServer(function (req, res) {
	
	if(req.url == '/') {
		serveStatic(indexPath, res);
	} else 
	if(req.url == '/triad?chord=a&quality=maj') {
		// when parsing pass true to parse the query as well
		var triad = url.parse(req.url, true).query;
		chord.lookup(triad.chord, triad.quality, res);
	} else if(req.url =='/a_min') {
		chord.lookup('a', 'min', res);
	} else if(req.url == '/d_min') {
		chord.lookup('d', 'min', res);
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
}).listen(port, function() {
	console.log('Listening on port ' + port + '...');
});

// Not yet working
// for(var i = 0; i < weight; i++) {
// 	server.listen(port+i);
// 	console.log('Listening on port ' + (port+i) +'...');
// }
