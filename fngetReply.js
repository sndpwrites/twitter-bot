var PythonShell = require('python-shell');
var args = {args:['cool','chatHistory.txt']}
var pyshell = new PythonShell('getReply.py',args);

pyshell.on('message', function(message) {
	console.log(message);
});


pyshell.end(function (err) {
	if (err) throw err;
	console.log('finished');
});
