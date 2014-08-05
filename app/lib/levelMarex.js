/**
 * @author William
 */

exports.loadLevelMarexData = function(param, callback) {
	dropTableLevelMarex();
	createTableLevel();
	deleteRecordLevelMarex();

	getLevelMarexHttp(param, callback);
};

function getLevelMarexHttp(param, callback) {
	Ti.API.info('level, cdsp, param ' + param.cdsp);
	Ti.API.info('level, flagactive, y ' + param.flagactive);
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info("response Text: " + this.responseText);
		var json = JSON.parse(this.responseText);
		for (var i = 0; i < json.length; i++) {
			//create model
			var _level = Alloy.createModel('level', {
				CD_SP : json[i].CD_SP,
				NO_LEVEL : json[i].NO_LEVEL,
				CD_LEVEL : json[i].CD_LEVEL,
				DESC_LEVEL : json[i].DESC_LEVEL,
				CD_ALIAS : json[i].CD_ALIAS,
				FLAG_ACTIVE : json[i].FLAG_ACTIVE,
				FLAG_PRINT : json[i].FLAG_PRINT,
				FLAG_MAIL : json[i].FLAG_MAIL,
				FLAG_SMS : json[i].FLAG_SMS,
			});

			//save to persistent
			Ti.API.info('level marex, save');
			_level.save();
		}

		callback(true);
	};
	anXhr.onerror = function() {
		setTimeout(function(){
			getLevelMarexHttp(param, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/mstLevelMarex.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var levelMarexParam = {
		flag_active : param.flagactive,
		cd_sp : param.cdsp
	};
	anXhr.send(JSON.stringify(levelMarexParam));
}

function deleteRecordLevelMarex() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecords = db.execute('DELETE FROM level');
	Ti.API.info('Affected rows : ' + db.getRowsAffected());
	db.close();
}

function dropTableLevelMarex(){
	var db = Ti.Database.open('_alloy_');
	db.execute('DROP TABLE level');
	db.close();
}

function createTableLevel() {
	//bootstrap the database
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS level(alloy_id TEXT, ' 
	+ 'CD_SP TEXT, ' + 'CD_LEVEL TEXT, NO_LEVEL TEXT, DESC_LEVEL TEXT, CD_ALIAS TEXT, ' + 
	'FLAG_ACTIVE TEXT, FLAG_PRINT TEXT, ' + 'FLAG_MAIL TEXT, FLAG_SMS TEXT);');
	db.close();
}

function loadFile() {
	var filename = "levelData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}