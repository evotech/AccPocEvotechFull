exports.getDataTrnMarex = function(param, callback) {
	createTableMarex();
	delMarexRecord();

	for (var i = 0; i < param.noreg.length; i++) {
		getMarexHttp(param.noreg[i].noreg, callback);
	}

	// var isSuccess = true;
	// callback(isSuccess);

};

function getMarex(param) {
	var json = loadFile();
	Ti.API.info('marex, load, file, ' + JSON.stringify(json));

	var noregs = param.noreg;
	for (var j = 0; j < noregs.length; j++) {
		for (var i = 0; i < json.length; i++) {
			if (noregs[j].noreg === json[i].NO_REGISTRATION) {
				var _marex = Alloy.createModel('marex', {
					NO_REGISTRATION : json[i].NO_REGISTRATION,
					NO_SR : json[i].NO_SR,
					NO_FIELD : json[i].NO_FIELD,
					CD_SUB_FIELD : json[i].CD_SUB_FIELD,
					VALUE_STANDAR : json[i].VALUE_STANDAR,
					VALUE_ACTUAL : json[i].VALUE_ACTUAL,
					VALUE_DEVIASI : json[i].VALUE_DEVIASI,
					FLAG_DEVIASI : json[i].FLAG_DEVIASI,
					STATUS : json[i].STATUS,
					NUM_STANDAR : json[i].NUM_STANDAR,
					NUM_ACTUAL : json[i].NUM_ACTUAL,
					NUM_DEVIASI : json[i].NUM_DEVIASI,
				});

				Ti.API.info('marex, save');
				_marex.save();
			}
		}
	}
}

exports.updMarexHttp = function(param, callback){
	updateMarexHttp(param, callback);
};

function updateMarexHttp(param, callback){
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	Ti.API.info('http, marex, update : ' + JSON.stringify(param));
	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		var json = JSON.parse(this.responseText);
		Ti.API.info("marex, responseText : " + json);

		callback(true);

	};
	anXhr.onerror = function() {
		setTimeout(function() {
			updateMarexHttp(param, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/trnMarex.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	var param = {
		type_s : param.type_s,
		no_reg : param.noreg,
		no_field : param.no_field,
		level_deviasi : param.level_deviasi,
		status : param.status
	};
	anXhr.send(JSON.stringify(param));
}

function getMarexHttp(noreg, callback) {
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	Ti.API.info('http, marex,noreg : ' + noreg);
	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info("marex, responseText : " + this.responseText);

		var json = JSON.parse(this.responseText);
		Ti.API.info("reg detail : " + json);

		for (var i = 0; i < json.length; i++) {
			var _marex = Alloy.createModel('marex', {
				NO_REGISTRATION : json[i].NO_REGISTRATION,
				NO_SR : json[i].NO_SR,
				NO_FIELD : json[i].NO_FIELD,
				CD_SUB_FIELD : json[i].CD_SUB_FIELD,
				VALUE_STANDAR : json[i].VALUE_STANDAR,
				VALUE_ACTUAL : json[i].VALUE_ACTUAL,
				VALUE_DEVIASI : json[i].VALUE_DEVIASI,
				FLAG_DEVIASI : json[i].FLAG_DEVIASI,
				STATUS : json[i].STATUS,
				NUM_STANDAR : json[i].NUM_STANDAR,
				NUM_ACTUAL : json[i].NUM_ACTUAL,
				NUM_DEVIASI : json[i].NUM_DEVIASI,
			});

			Ti.API.info('marex, save');
			_marex.save();
		};
		callback(true);

	};
	anXhr.onerror = function() {
		setTimeout(function() {
			getMarexHttp(noreg, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/trnMarex.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	var detailreg = {
		no_reg : noreg
	};
	anXhr.send(JSON.stringify(detailreg));
};

function delMarexRecord() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecord = db.execute('DELETE FROM marex');
	Ti.API.info('marex, row affected, ' + db.getRowsAffected());
	db.close();
}

function createTableMarex() {
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS marex (alloy_id TEXT, ' + 
	'NO_REGISTRATION TEXT, ' + 
	'NO_SR TEXT, NO_FIELD TEXT, CD_SUB_FIELD TEXT, ' + 
	'VALUE_STANDAR TEXT, VALUE_ACTUAL TEXT, VALUE_DEVIASI TEXT, FLAG_DEVIASI TEXT, ' + 
	'STATUS TEXT, NUM_STANDAR TEXT, NUM_ACTUAL TEXT, NUM_DEVIASI DOUBLE);');
	db.close();
}

exports.updateStatusMarex = function (status, alloyId){
	var db = Ti.Database.open('_alloy_');
	Ti.API.info('status, marexlib, update, ' + status);
	Ti.API.info('alloyId, marexlib, update, ' + alloyId);
	db.execute('UPDATE marex SET STATUS=? WHERE alloy_id = ?', status, alloyId);
	Ti.API.info('marex, update, rowAffected, ' + db.getRowsAffected());
	db.close();
};

function loadFile() {
	var filename = "trnMarexData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}
