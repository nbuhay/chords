var error = require('./errorController.js');
var fs = require('fs');

var notFoundPath = './public/404.html';

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

exports.scaleLookup = function (quality, intonation, tonic, res) {
	console.log("quality value : " + quality);
	var scalePath = "./"+quality+"_scale.json";
	// console.log(scalePath); Will need to check and make sure no error on scale path
	fs.readFile(scalePath, function(err, data) {
		if(err) {
			fs.readFile(notFoundPath, function(err, html) {
				if(err) {
					error.emit('err', err);
					res.send(500, 'Somebody poisoned the water hole!');
				} else {
					console.log('Idiot');
					res.writeHead(404, {'Content-Type': 'text/html'});
					error.emit(404, 'Scale data not found');
					res.end(html);
				}
			});
		} else {
			var scale = JSON.parse(data);
			scale = scale[intonation][tonic];
			var body = 	'<h1>'+(scale[0].note)+' Major</h1>';
			for(var i = 0; i < scale.length; i++) {
				body+='<p>'+scale[i].name+': '+scale[i].note;
				if(scale[i].intonation) {
					body+=' '+scale[i].intonation+'</p><br>';
				} else {
					body+='</p><br>'
				}
			}
			res.setHeader('Content-Length', Buffer.byteLength(body));
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(body);
		}
	});
}

// exports.calcTriad = function(scale) {
// 	var triad = {scale[0], scale[2], scale[4]};
// 	return triad;
// }