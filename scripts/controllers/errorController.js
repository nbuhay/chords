// assigns only EventEmitter of events
var EventEmitter = require('events').EventEmitter;

// make the events globally available from errorController.js
module.exports = new EventEmitter();

// Generic error handler for servers
module.exports.on('err', function(err) {
	console.log('Generic Error: ' + err);
});

module.exports.on('404', function(err) {
	console.log('404 Error: ' + err);
});	

module.exports.on('chord404', function(chord, quality) {
	console.log('Error: Chord ' + chord + ' of quality ' + quality + ' not found.');
});