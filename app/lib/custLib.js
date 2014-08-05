exports.loadCustData = function(param, callback) {
	createTableCust();
	deleteRecordCust();

	for (var i = 0; i < param.length; i++) {
		getCustHTTP(param[i].noreg, callback);
	}

	//check get cust data success or not
	// var isSuccess = true;
	// callback(isSuccess);
};

function getCust(param) {
	Ti.API.info('getCust');
	var json = loadFile();
	Ti.API.info('Cust detail : ' + JSON.stringify(json));

	for (var j = 0; j < param.length; j++) {
		for (var i = 0; i < json.length; i++) {
			Ti.API.info('cust, param, noreg, compare, ' + json[i].NO_REGISTRATION + " - " + param[j].noreg);
			if (json[i].NO_REGISTRATION === param[j].noreg) {
				var _cust = Alloy.createModel('cust', {
					NO_REGISTRATION : json[i].NO_REGISTRATION,
					FLAG_PC : json[i].FLAG_PC,
					FLAG_BCG : json[i].FLAG_BCG,
					NO_G : json[i].NO_G,
					CD_CUSTOMER : json[i].NO_G,
					CD_CUST_SPECIAL : json[i].CD_CUST_SPECIAL,
					CD_TITLE : json[i].CD_TITLE,
					NAME : json[i].NAME,
					LN_REST_ADDR1 : json[i].LN_REST_ADDR1
				});
				//save to persistent
				_cust.save();
				Ti.API.info('save, cust');
			}
		}
	}
}

function getCustHTTP(noreg,callback) {
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info("cust detail: " + this.responseText);
		var json = JSON.parse(this.responseText);

		for (var i = 0; i < json.length; i++) {
			var _cust = Alloy.createModel('cust', {
				NO_REGISTRATION : json[i].NO_REGISTRATION,
				FLAG_PC : json[i].FLAG_PC,
				FLAG_BCG : json[i].FLAG_BCG,
				NO_G : json[i].NO_G,
				CD_CUSTOMER : json[i].NO_G,
				CD_CUST_SPECIAL : json[i].CD_CUST_SPECIAL,
				CD_TITLE : json[i].CD_TITLE,
				NAME : json[i].NAME,
				LN_REST_ADDR1 : json[i].LN_REST_ADDR1
			});
			//save to persistent
			Ti.API.info('cust, save');
			_cust.save();
		};
		
		callback(true);
	};
	anXhr.onerror = function() {
		setTimeout(function(){
			getCustHTTP(noreg, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/tmpCustRd.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var param = {
		"no_reg" : noreg
	};
	anXhr.send(JSON.stringify(param));
};

function deleteRecordCust() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecords = db.execute('DELETE FROM cust');
	Ti.API.info('Affected rows : ' + db.getRowsAffected());
	db.close();
}

function createTableCust() {
	//bootstrap the database
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS cust(alloy_id TEXT, ' + 'NO_REGISTRATION TEXT, ' + 'FLAG_PC TEXT, FLAG_BCG TEXT, NO_G TEXT, ' + 'CD_CUSTOMER TEXT, CD_CUST_SPECIAL TEXT, ' + 'CD_TITLE TEXT, NAME TEXT, LN_REST_ADDR1 TEXT);');
	db.close();
}

function loadFile() {
	var filename = "custData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}
