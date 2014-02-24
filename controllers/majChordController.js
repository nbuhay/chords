var error = require('./errorController.js');
var fs = require('fs');

exports.lookup = function (chord) {
	fs.readFile('./chord_list.json', function(err, data) {
		if(err) {
			error.emit('err', err);
			return false;
		} else {
			console.log(JSON.parse(data.toString()).maj.a);
			return true;
		}
	});
}