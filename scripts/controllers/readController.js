var fs = require('fs');
var error = require('./errorController.js');

// will set up all static returns
exports.load = function(url, res, statusCode) {
	var content = fs.readFileSync(url, 'utf-8');
	if(content) {
		res.statusCode = statusCode;
		res.setHeader('Content-Length', Buffer.byteLength(content));
		res.setHeader('Content-Type', 'text/html');
		return content;
	} else {
		// Error for file
		error.emit('500');
		res.end();
	}
}