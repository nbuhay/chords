// assigns only EventEmitter of events
var EventEmitter = require('events').EventEmitter;
var read = require('./readController.js');
var chord404 = './public/chord404.html';

// make the events globally available from errorController.js
module.exports = new EventEmitter();

// Generic error handler for servers
module.exports.on('err', function(err) {
	console.log('Generic Error: ' + err);
});

module.exports.on('404', function(err) {
	console.log('404 Error: ' + err);
});	

module.exports.on('chord404', function(chord, quality, res) {
	read.load(chord404, res, 404);
	console.log('Error: Chord ' + chord + ' of quality ' + quality + ' not found.');
});

module.exports.on('500', function(err) {
	console.log('500 Error: ' + err);
})