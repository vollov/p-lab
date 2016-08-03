var fs = require("fs");
var path = __dirname + "/data/f2.txt";
var data = "Lorem ipsum dolor sit amet";

fs.open(path, "w", function(error, fd) {
	var buffer = new Buffer(data);
	fs.write(fd, buffer, 0, buffer.length, null, function(error, written,
			buffer) {
		if (error) {
			console.error("write error: " + error.message);
		} else {
			console.log("Successfully wrote " + written + " bytes.");
			
			fs.close(fd, function(error) {
				if (error) {
					console.error("close error: " + error.message);
				}
				console.log('file closed!');
			});
		}
	});
});
