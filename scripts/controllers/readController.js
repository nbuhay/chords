var fs = require('fs');
var error = require('./errorController.js');

// will set up all static returns
exports.load = function(url, res, statusCode) {
	var stream = fs.createReadStream(url);
	stream.on('data', function(chunk) {
		res.write(chunk);
	});
	stream.on('end', function() {
		res.statusCode = statusCode;
		res.end();
	});
}