exports.getDataLogin = function(param, callback) {
	createUserTable();
	delUserTable();
	getUserLoginHTTP(param, function(isAuth) {
		Ti.API.info('isAuth' + isAuth);
		callback(isAuth);
	});
};

function getUserLogin(param, callback) {
	var json = loadFile();
	Ti.API.info('Data User, File');
	Ti.API.info('get json file: \n' + JSON.stringify(json));

	var _cdlevel = [];

	for (var i = 0; i < json.length; i++) {
		if (param.username === json[i].ID_USER) {
			var _user = Alloy.createModel('user_marex', {
				CD_LEVEL : json[i].CD_LEVEL,
				ID_USER : json[i].ID_USER,
				CD_SP : json[i].CD_SP,
				FLAG_ACTIVE : json[i].FLAG_ACTIVE,
				EMAIL_ADDR : json[i].EMAIL_ADDR,
				NO_HP : json[i].NO_HP,
				BRAND_ASTRA : json[i].BRAND_ASTRA,
				FLAG_NEW_USED : json[i].FLAG_NEW_USED,
				NO_SR : json[i].NO_SR
			});
			//save to persistent
			_user.save();

			//save cdsp, cdlevel
			_cdlevel.push(json[i].CD_LEVEL);
			//Ti.App.Properties.setList('cdlevel', _cdlevel);
			Ti.App.Properties.setString('cdsp', json[i].CD_SP);
			Ti.App.Properties.setString('user', json[i].ID_USER);

			callback(true);
		} else {
			callback(false);
			break;
		}
	}
}

function getUserLoginHTTP(param, callback) {
	Ti.API.info('Data user, http request');
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info("login : " + this.responseText);
		// alert(this.responseText);
		var user = [];

		var json = JSON.parse(this.responseText);
		Ti.API.info('length of obj : ' + json.length);
		if (json.length > 0) {
			var _cdlevel = [];

			for (var i = 0; i < json.length; i++) {
				var _user = Alloy.createModel('user_marex', {
					CD_LEVEL : json[i].CD_LEVEL,
					ID_USER : json[i].ID_USER,
					CD_SP : json[i].CD_SP,
					FLAG_ACTIVE : json[i].FLAG_ACTIVE,
					EMAIL_ADDR : json[i].EMAIL_ADDR,
					NO_HP : json[i].NO_HP,
					BRAND_ASTRA : json[i].BRAND_ASTRA,
					FLAG_NEW_USED : json[i].FLAG_NEW_USED,
					NO_SR : json[i].NO_SR
				});
				//save to persistent
				_user.save();
				//save cdsp, cdlevel
				_cdlevel.push(json[i].CD_LEVEL);
				// Ti.App.Properties.setList('cdlevel', _cdlevel);
				Ti.App.Properties.setString('cdsp', json[i].CD_SP);
				Ti.App.Properties.setString('user', json[i].ID_USER);
			}
			callback(true);
		} else {
			callback(false);
		}
	};
	anXhr.onerror = function() {
		setTimeOut(function() {
			getUserLoginHTTP(param, callback);
		}, 2000);
		alert('The HTTP request failed, trying to reconnect');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/mstUserMarex.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var loginParam = {
		id_user : param.username,
		password : param.password
	};
	anXhr.send(JSON.stringify(loginParam));
};

function logout() {
	//delAllRecordsFromAllTable();
}

function delAllRecordsFromAllTable() {
	var db = Ti.Database.open('_alloy_');
	var deleteBucketMarexRecord = db.execute('DELETE FROM bucket_marex');
	Ti.API.info('Affected Bucket Rows : ' + db.getRowsAffected());
	var deleteCustRecord = db.execute('DELETE FROM cust');
	Ti.API.info('Affected Cust rows : ' + db.getRowsAffected());
}

function delUserTable() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecords = db.execute('DELETE FROM user_marex');
	Ti.API.info('Affected rows : ' + db.getRowsAffected());
	db.close();
}

function createUserTable() {
	//bootstrap the database
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS user_marex(alloy_id TEXT, ' + 'CD_LEVEL TEXT, ID_USER TEXT, CD_SP TEXT, FLAG_ACTIVE TEXT, EMAIL_ADDR TEXT, ' + 'NO_HP TEXT, BRAND_ASTRA TEXT, FLAG_NEW_USED TEXT, NO_SR TEXT);');
	db.close();
}

function loadFile() {
	var filename = "userMarexData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}
