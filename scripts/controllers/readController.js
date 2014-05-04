var fs = require('fs');
var error = require('./errorController.js');

// will set up all static returns
exports.load = function(url, res) {
	var stream = fs.createReadStream(url);
	//stream.pipe(res);
	stream.on('data', function(chunk) {
		res.write(chunk);
	});
	stream.on('end', function() {
		res.statusCode = 200;
		res.end();
	});
	stream.on('error', function(err) {
		error.emit('500', err);
		res.end(err);
	});
}