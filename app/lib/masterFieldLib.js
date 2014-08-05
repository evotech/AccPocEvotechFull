/**
 * @author William
 */

var masterFields = Alloy.createCollection('master_field');

exports.loadMasterFieldData = function(param, callback) {
	createTableMasterField();
	deleteRecordMasterField();
	Ti.API.info('mstField, param, ' + JSON.stringify(param));
	for (var i = 0; i < param.nofield.length; i++) {
		Ti.API.info('mstfield, for');
		getMasterFieldHttp(param.nofield[i], callback);
	}
};

function getMasterFieldHttp(param, callback) {
	Ti.API.info('masterfield, no field, param ' + param.nofield);
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		//load collection

		// Handle the XML data.
		Ti.API.info("response Text: " + this.responseText);
		var json = JSON.parse(this.responseText);
		for (var i = 0; i < json.length; i++) {
			//create model
			var _master_field = Alloy.createModel('master_field', {
				NO_FIELD : json[i].NO_FIELD,
				DESC_FIELD : json[i].DESC_FIELD,
				FLAG_ACTIVE : json[i].FLAG_ACTIVE,
				CD_FIELD : json[i].CD_FIELD,
				CD_SP : json[i].CD_SP,
				CD_SP_COLL : json[i].CD_SP_COLL,
			});

			masterFields.fetch({
				query : 'SELECT * FROM master_field WHERE NO_FIELD="' + json[i].NO_FIELD + '"'
			});
			//save to persistent
			Ti.API.info('masterField, save');
			if (masterFields.length === 0) {
				_master_field.save();
			}
		}

		callback(true);
	};
	anXhr.onerror = function() {
		setTimeout(getMasterFieldHttp(param, callback), 2000);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/mstField.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var masterFieldParam = {
		no_field : param.nofield,
	};
	anXhr.send(JSON.stringify(masterFieldParam));
}

function deleteRecordMasterField() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecords = db.execute('DELETE FROM master_field');
	Ti.API.info('Affected rows : ' + db.getRowsAffected());
	db.close();
}

function createTableMasterField() {
	//bootstrap the database
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS master_field(alloy_id TEXT, ' + 'NO_FIELD TEXT, ' + 'DESC_FIELD TEXT, FLAG_ACTIVE TEXT, CD_FIELD TEXT, ' + 'CD_SP TEXT, CD_SP_COLL TEXT);');
	db.close();
}

function loadFile() {
	var filename = "masterFieldData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}