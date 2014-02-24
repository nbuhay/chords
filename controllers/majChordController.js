var events = require('events');
var majChordEvent = new events.EventEmitter();
var fs = require('fs');

exports.lookup = function (chord) {
	fs.readFile('./chord_list.json', function(err, data) {
		// Always have an error return for requests!
		// Write 'err' handler in test.js
		// THIS IS NOT WORKING
		if(err) {
			majChordEvent.emit('err', err);
			return false;
		} else {
			var notes = JSON.parse(data.toString());
			console.log(notes.maj.a);
			return true;
		}
	});
}