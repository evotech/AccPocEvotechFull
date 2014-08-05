/**
 * @author William
 */
function getImageHttp(param, callback) {

	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(500);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info("response Text: " + this.responseText);
		var json = JSON.parse(this.responseText);
		for (var i = 0; i < json.length; i++) {

			//save to persistent
			_bucket.save();
		}

		callback(true);
	};
	anXhr.onerror = function() {
		setTimeout(function() {
			getImageHttp(param, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/var/www/html/pocmobile/photosurvey/xxx.jpg');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var param = {
		
	};
	anXhr.send(JSON.stringify(param));
};