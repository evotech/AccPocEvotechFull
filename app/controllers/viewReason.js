var args = arguments[0] || {};
//lib
var marexLib = require('trnMarex');
var bucketMarexLib = require('bucketMarex');
//collection
var userMarexs = Alloy.createCollection('user_marex');

Ti.API.info('viewreason, args,' + JSON.stringify(args));

function submit() {

	//show loading screen

	//get args
	var tmpColls = args;
	var arr = tmpColls.toJSON();
	//check if internet connection is available or not

	//update marex
	for (var i = 0; i < arr.length; i++) {

		var param = {
			type_s : 'U',
			no_reg : arr[i].NO_REGISTRATION,
			no_field : arr[i].NO_FIELD,
			level_deviasi : Ti.App.Properties.getString('user', null),
			status : arr[i].STATUS,
			alloyId : arr[i].alloyId
		};
		Ti.API.info('status ' + param.status);

		if (isInternetAvailable()) {
			Ti.API.info('update , marex, http');
			marexLib.updMarexHttp(param, function(isSuccess) {
				if (isSuccess)
					Ti.API.info('marex, update to server, success');
				else
					Ti.API.info('marex, update to server, failed');
			});
		} else {
		}
		Ti.API.info('marex, update, local');
		marexLib.updateStatusMarex(param.status, param.alloyId);
	}

	//update bucketMarex,

	var isFinal = false;
	//cek for final approval to get status

	var paramNotFinal = {
		type_s : 'U',
		no_reg : arr[0].NO_REGISTRATION,
		id_user : Ti.App.Properties.getString('user', null),
		level : Ti.App.Properties.getString('cdlevel', null),
		status : 'A',
		reason : $.textAreaReason.value
	};

	var paramFinal = {
		type_s : 'U',
		no_reg : arr[0].NO_REGISTRATION,
		status : 'A'
	};

	if (isInternetAvailable()) {
		Ti.API.info('update ,bucket marex, http');
		if (isFinal) {
			bucketMarexLib.updateBucketMarexHttp(paramFinal, function(isSuccess) {
			}, true);
		} else {
			bucketMarexLib.updateBucketMarexHttp(paramNotFinal, function(isSuccess) {

			}, false);
		}
	} else {
	}
	var date = new Date();
	var param = new Object();
	var userLv = Ti.App.Properties.getString('cdlevel', null);
	param = {
		l1User : Ti.App.Properties.getString('user'),
		l1Date : date.toUTCString(),
		l1Time : date.toTimeString(),
		l1Result : 'BM',
		l1Level : 'BM',
		noreg : arr[0].NO_REGISTRATION,
		reason : $.textAreaReason.value
	};
	if (isFinal) {

	} else {
		if (userLv === 'BM') {
			Ti.API.info('updateBucketMarex BM');
			param.l1Result = 'BM';
			param.l1Level = 'BM';
			bucketMarexLib.updateBucketMarex(param, param.noreg, "l1");
		} else if (userLv === 'RRSH') {
			Ti.API.info('updateBucketMarex RRSH');
			param.l1Result = 'RRSH';
			param.l1Level = 'RRSH';
			bucketMarexLib.updateBucketMarex(param, param.noreg, "l2");
		} else if (userLv === 'RRSDH') {
			Ti.API.info('updateBucketMarex RRSDH');
			param.l1Result = 'RRSDH';
			param.l1Level = 'RRSDH';
			bucketMarexLib.updateBucketMarex(param, param.noreg, "l3");
		} else {
		}
	}

	//update bucket marex local
	//remove loading screen
	$.winViewReason.close();
}

function isInternetAvailable() {
	if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
		return false;
	} else {
		return true;
	}
}

