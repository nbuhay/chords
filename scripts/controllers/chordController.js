var error = require('./errorController.js');
var fs = require('fs');
var nimble = require('nimble');
var noteList = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var nameList = ['tonic', 'supertonic', 'mediant', 'subdominant', 'dominant', 'supermediant', 'leadingTone'];
var modeList = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

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

var findCorrectModeTonic = function(tonic, modeDegree) {
	console.log("in findCorrectModeTonic");
	for(var i = noteList.length-modeDegree, j = 0; i < noteList.length; i++, j++) {
		if(noteList.indexOf(tonic) == j) {
			return noteList[i];
		}
	}
	return noteList(noteList.indexOf(tonic)-modeDegree);
}

exports.scaleLookup = function (quality, intonation, tonic, res) {
	console.log("quality value : " + quality);
	var scalePath = "./major_scale.json";
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
			var modeTonic;
			var modeDegree;  // based off array indexing i.e. dorian is second mode thus modeDegree is 2

			if(quality == 'ionian') {
				scale = scale[intonation][tonic];
			} else {
				modeDegree = modeList.indexOf(quality);
				modeTonic = findCorrectModeTonic(tonic, modeDegree);

				if (scale['natural'][modeTonic][modeDegree].note == tonic &&
					scale['natural'][modeTonic][modeDegree].intonation == intonation) {
						scale = scale['natural'][modeTonic];
				} else if (scale['sharp'][modeTonic][modeDegree].name == tonic &&
					scale['sharp'][modeTonic][modeDegree].intonation == intonation) {
						scale = scale['sharp'][modeTonic];
				} else {
					scale = scale['flat'][modeTonic];
				}

				// append incorrect tonic from correct major scale to end
				while(scale[0].note != tonic) {
					scale.push(scale.shift());
				}

				// map correct names to the scale
				for(var i = 0; i < scale.length; i++) {
					scale[i].name = nameList[i];
				}
			}

			// Setup the model
			var body = 	'<h1>'+tonic+' '+quality+'</h1>';
			for(var i = 0; i < scale.length; i++) {
				body+='<p>'+scale[i].name+': '+scale[i].note;
				if(scale[i].intonation) {
					body+=' '+scale[i].intonation+'</p><br>';
				} else {
					body+='</p><br>'
				}
			}
			
			// return model
			res.setHeader('Content-Length', Buffer.byteLength(body));
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(body);
		}
	});
}