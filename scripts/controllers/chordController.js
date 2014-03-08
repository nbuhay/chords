var error = require('./errorController.js');
var fs = require('fs');

// find notes of chord of certain quality i.e. maj or min
exports.lookup = function (chord, quality) {
	fs.readFile('./chord_list.json', function(err, data) {
		if(err) {
			error.emit('err', err);
		} else {
			var chords = JSON.parse(data.toString());
			for(index in chords[quality]) {
				if(index == chord) {
					// Return something here
					console.log(chords[quality][index]);
					return;
				}
			}
			error.emit('chord404', chord, quality);
		}
	});
}