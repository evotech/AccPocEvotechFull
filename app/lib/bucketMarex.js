exports.loadBucketMarexData = function(param, callback) {
	createBucketMarexTable();
	delBucketMarexRecords();
	getBucketMarexHttp(param, callback);

	//cek if request data is success
	// var isSuccess = true;
	// callback(isSuccess);
};

//load data from local json file/ server
function getBucketMarex(param) {
	Ti.API.info('getBucketMarex');
	var json = loadFile();
	Ti.API.info('get json file: \n' + JSON.stringify(json));
	//var bucketMarexs = Alloy.createCollection('bucket_marex');
	for (var i = 0; i < json.length; i++) {
		if (json[i].CD_SP === param.cd_sp) {
			//create model
			var _bucket = Alloy.createModel('bucket_marex', {
				NO_REGISTRATION : json[i].NO_REGISTRATION,
				CD_SP : json[i].CD_SP,
				L1_USER : json[i].L1_USER,
				L1_DATE : json[i].L1_DATE,
				L1_TIME : json[i].L1_TIME,
				L1_RESULT : json[i].L1_RESULT,
				L1_LEVEL : json[i].L1_LEVEL,
				L2_USER : json[i].L2_USER,
				L2_DATE : json[i].L2_DATE,
				L2_TIME : json[i].L2_TIME,
				L2_RESULT : json[i].L2_RESULT,
				L2_LEVEL : json[i].L2_LEVEL,
				L3_USER : json[i].L3_USER,
				L3_DATE : json[i].L3_DATE,
				L3_TIME : json[i].L3_TIME,
				L3_RESULT : json[i].L3_RESULT,
				L3_LEVEL : json[i].L3_LEVEL,
				STATUS : json[i].STATUS,
				BRAND_ASTRA : json[i].BRAND_ASTRA,
				FLAG_NEW_USED : json[i].FLAG_NEW_USED,
			});

			//save to persistent
			_bucket.save();
		}
	}
};

function updateBucketMarexHttp(param, callback, isFinal) {
	// Create an HTTPClient.
	Ti.API.info('update, bucketMarex, http');
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		var json = JSON.parse(this.responseText);
		Ti.API.info("response Text: " + JSON.stringify(json));

		callback(true);
	};
	anXhr.onerror = function() {
		setTimeout(function() {
			updateBucketMarexHttp(param, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/trnBucketMarex.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var param = new Object();
	if (!isFinal) {
		param = {
			type_s : param.typeS,
			no_reg : param.noReg,
			id_user : param.idUser,
			level : param.level,
			status : param.status,
			reason : param.reason
		};
	} else {
		param = {
			type_s : param.typeS,
			no_reg : param.noReg,
			status : param.status
		};
	}
	Ti.API.info('marex bucket, param, update, '+ JSON.stringify(param));
	anXhr.send(JSON.stringify(param));
}

function getBucketMarexHttp(param, callback) {

	Ti.API.info('bucket ' + param.type_s);
	Ti.API.info('bucket cdsp ' + param.cd_sp);
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(500);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info("response Text: " + this.responseText);
		var json = JSON.parse(this.responseText);
		for (var i = 0; i < json.length; i++) {
			//create model
			var _bucket = Alloy.createModel('bucket_marex', {
				NO_REGISTRATION : json[i].NO_REGISTRATION,
				CD_SP : json[i].CD_SP,
				L1_USER : json[i].L1_USER,
				L1_DATE : json[i].L1_DATE,
				L1_TIME : json[i].L1_TIME,
				L1_RESULT : json[i].L1_RESULT,
				L1_LEVEL : json[i].L1_LEVEL,
				L2_USER : json[i].L2_USER,
				L2_DATE : json[i].L2_DATE,
				L2_TIME : json[i].L2_TIME,
				L2_RESULT : json[i].L2_RESULT,
				L2_LEVEL : json[i].L2_LEVEL,
				L3_USER : json[i].L3_USER,
				L3_DATE : json[i].L3_DATE,
				L3_TIME : json[i].L3_TIME,
				L3_RESULT : json[i].L3_RESULT,
				L3_LEVEL : json[i].L3_LEVEL,
				STATUS : json[i].STATUS,
				BRAND_ASTRA : json[i].BRAND_ASTRA,
				FLAG_NEW_USED : json[i].FLAG_NEW_USED,
			});

			//save to persistent
			_bucket.save();
		}

		callback(true);
	};
	anXhr.onerror = function() {
		setTimeout(function() {
			getBucketMarexHttp(param, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/trnBucketMarex.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var bucketMarexParam = {
		type_s : param.type_s,
		cd_sp : param.cd_sp
	};
	anXhr.send(JSON.stringify(bucketMarexParam));
};

//delete all record from table
function delBucketMarexRecords() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecords = db.execute('DELETE FROM bucket_marex');
	Ti.API.info('Affected Rows : ' + db.getRowsAffected());
	db.close();
};

function createBucketMarexTable() {
	//bootstrap the database
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS bucket_marex(alloy_id TEXT, ' + 'NO_REGISTRATION TEXT, CD_SP TEXT, ' + 'L1_USER TEXT, L1_DATE TEXT, L1_TIME TEXT, L1_RESULT TEXT, L1_LEVEL TEXT, ' + 'L2_USER TEXT, L2_DATE TEXT, L2_TIME TEXT, L2_RESULT TEXT, L2_LEVEL TEXT, ' + 'L3_USER TEXT, L3_DATE TEXT, L3_TIME TEXT, L3_RESULT TEXT, L3_LEVEL TEXT, ' + 'STATUS TEXT, BRAND_ASTRA TEXT, FLAG_NEW_USED TEXT);');
	db.close();
}

exports.updateBucketMarexHttp = function(param, callback, isFinal){
	updateBucketMarexHttp(param,callback,isFinal);
};

exports.updateBucketMarex = function(param, noreg, l) {
	Ti.API.info(l);
	if (l === "l1") {
		updateBucketMarexL1(param, noreg);
	} else if (l === "l2") {
		updateBucketMarexL2(param, noreg);
	} else if (l === "l3") {
		updateBucketMarexL3(param, noreg);
	} else {
		return;
	}
	
};

function updateBucketMarexL1(param, noreg) {
	var db = Ti.Database.open('_alloy_');
	db.execute('UPDATE bucket_marex SET L1_USER = ?, L1_DATE = ?, L1_TIME = ?, ' +
	 'L1_RESULT = ?, L1_LEVEL = ? WHERE NO_REGISTRATION = ? ', +
	 param.l1User, param.l1Date, param.l1Time, param.l1Result, param.l1Level, noreg);
	db.close();
}

function updateBucketMarexL2(param, noreg) {
	var db = Ti.Database.open('_alloy_');
	db.execute('UPDATE bucket_marex SET L2_USER = ?, L2_DATE = ?, L2_TIME = ?, ' + 'L2_RESULT = ?, L2_LEVEL = ? WHERE NO_REGISTRATION = ? ', 
	+param.l1User, param.l1Date, param.l1Time, param.l1Result, param.l1Level, noreg);
	db.close();
}

function updateBucketMarexL3(param, noreg) {
	var db = Ti.Database.open('_alloy_');
	db.execute('UPDATE bucket_marex SET L3_USER = ?, L3_DATE = ?, L3_TIME = ?, ' + 'L3_RESULT = ?, L3_LEVEL = ? WHERE NO_REGISTRATION = ? ', 
	+param.l1User, param.l1Date, param.l1Time, param.l1Result, param.l1Level, noreg);
	db.close();
}

function getAllNoRegistration() {
}

function loadFile() {
	var filename = "bucketMarexData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}
