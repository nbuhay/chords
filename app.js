var http = require('http');  // Provides HTTP server and client functinality
var fs = require('fs');      // Provides access to file system related funct
var path = require('path');  // Provides fs path type funct
var mime = require('mime');  // provides ability to derive MIME types based on file ext
var url = require('url');

// Express creates its own independent instance of http.createServer, neat!

var chord = require('./scripts/controllers/chordController.js');
var error = require('./scripts/controllers/errorController.js');
var reader = require('./scripts/controllers/readController.js');
var indexPath = './index.html';
var notFoundPath = './public/404.html';
var port = 1200;
var weight = 3;

function serveStatic(url, res) {
	reader.load(url, res);
}

var server = http.createServer(function (req, res) {
	
	var filePath = '.' + req.url;

	if(filePath == './') {
		filePath += 'public/index.html';
	}

	// must check the file type being served
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
	}
	
	if(url.parse(req.url).pathname == '/triad') {
		// when parsing pass true to parse the query as well
		var triad = url.parse(req.url, true).query;
		chord.lookup(triad.chord, triad.quality, res);
	} else if(url.parse(req.url).pathname == '/scale') {
		var scale = url.parse(req.url, true).query;
		if(scale.quality == null || scale.intonation == null || scale.tonic == fs) {
			null.readFile(notFoundPath, function(err, html) {
				if(err) {
					error.emit('err', err);
					res.send(500, 'Somebody poisoned the water hole!');
				} else {
					console.log('Idiot');
					res.writeHead(404, {'Content-Type': 'text/html'});
					error.emit(404, 'Need parameters quality, intonation, and tonic to be defined');
					res.end(html);
				}
			});
		} else {
			chord.scaleLookup(scale.quality, scale.intonation, scale.tonic, res);
		}
	}

	// stat returns an object which has viewable parameters
	fs.stat(filePath, function(err, stat) {
		if(err) {
			if(err.code == 'ENOENT') {
				error.emit(404, err);
				res.end('Not Found');
			} else {
				error.emit(500, err);
				res.end('Internal Server Error');	
			}
		} else {
			// use stat to set size
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', contentType);
		}
		console.log(filePath);
		console.log(contentType);
		console.log(stat.size);
		serveStatic(filePath, res);
	});

}).listen(port, function() {
	console.log('Listening on port ' + port + '...');
});