function doSomething() {
	return true;
}

// EXAMPLE OF MULTIPLE CALLBACKS AS ARGUMENTS

// exported for external use, runs functions based on value returned
// by do something, which as is is true
exports.asyncFunction = function (failure, success) {
	if(doSomething()) {
		success();
	} else {
		failure();
	}
}