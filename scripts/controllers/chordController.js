var error = require('./errorController.js');
var fs = require('fs');

// find notes of chord of certain quality i.e. maj or min
exports.lookup = function (chord, quality, res) {
	fs.readFile('./chord_list.json', function(err, data) {
		if(err) {
			error.emit('err', err);
		} else {
			var chords = JSON.parse(data.toString());
			for(index in chords[quality]) {
				if(index == chord) {
					var body = '<h1>'+chords[quality][index]+'<h1>';
					// Return something here
					res.setHeader('Chord', chord);
					res.setHeader('Chord-Quality', quality);
					// Setting a content-length will speed up the response
					res.setHeader('Content-Length', Buffer.byteLength(body));
					// Set the content type to speed up as well
					// res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.end(body);
					return;
				}
			}
			error.emit('chord404', chord, quality, res);
		}
	});
}

exports.scaleLookup = function (type, tonic, res) {
	fs.readFile('./major_scale.json', function(err, data) {
		if(err) {
			error.emit('err', err);
		} else {
			var scale = JSON.parse(data.toString());
			var body = 	'<h1>'+(scale[type][tonic][0].note)+' Major</h1>' +
						'<p>'+scale[type][tonic][0].name+': '+scale[type][tonic][0].note+'</p><br>' +
						'<p>'+scale[type][tonic][1].name+': '+scale[type][tonic][1].note+'</p><br>';
			console.log(scale[type][tonic]);
			res.setHeader('Content-Length', Buffer.byteLength(body));
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(body);
			return;
		}
	});
}