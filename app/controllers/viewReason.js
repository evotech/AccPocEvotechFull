var args = arguments[0] || {};
//lib
var marexLib = require('trnMarex');
var bucketMarexLib = require('bucketMarex');
//collection
var userMarexs = require('user_marex');

Ti.API.info('viewreason, args,' + JSON.stringify(args));

function submit(e) {

	//show loading screen

	//check if internet connection is available or not
	if (isInternetAvailable()) {
		//if y, send to server
		//update bucketMarex, update marex

	} else {

	}
	//update marex local
	for (var i = 0; i < args.length; i++) {
		var status = args[0].STATUS;
		var alloyId = args[0].alloyId;
		marexLib.updateStatusMarex(status, alloyId);
	}
	
	//update bucket marex local
	var userLv = Ti.App.Properties.getString('cdlevel', null);
	var noreg = args[i].NO_REGISTRATION;
	userMarexs.fetch();
	var param = new Object();
	var tmpUserMarex = Alloy.createModel('user_marex', null);
	// param.l1User, param.l1Date, param.l1Time, param.l1Result, param.l1Level, noreg
	var date = new Date();
	if (userLv === 'BM') {
		param = {
			l1User : Ti.App.Properties.getString('user'),
			l1Date : date.toUTCString(),
			l1Time : date.toTimeString(),
			l1Result : userLv,
			l1Level : 'BM',
			noreg : noreg,
			reason : $.textAreaReason.value
		};
		bucketMarex.updateBucketMarexL1(param, noreg);
	} else if (userLv === 'RRSH') {
		param = {
			l2User : Ti.App.Properties.getString('user'),
			l2Date : date.toUTCString(),
			l2Time : date.toTimeString(),
			l2Result : userLv,
			l2Level : 'RRSH',
			noreg : noreg,
			reason : $.textAreaReason.value
		};
		bucketMarex.updateBucketMarexL2(param, noreg);
	} else if (userLv === 'RRSDH') {
		param = {
			l3User : Ti.App.Properties.getString('user'),
			l3Date : date.toUTCString(),
			l3Time : date.toTimeString(),
			l3Result : userLv,
			l3Level : 'BM',
			noreg : noreg,
			reason : $.textAreaReason.value
		};
		bucketMarex.updateBucketMarexL3(param, noreg);
	} else {
	}
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

