var args = arguments[0] || {};
//lib
var bucketMarexLib = require('bucketMarex');
var custLib = require('custLib');
var loanLib = require('loanLib');
var marexLib = require('trnMarex');
var levelLib = require('levelMarex');
var masterField = require('masterFieldLib');
//collection
var bucketMarexs = Alloy.createCollection('bucket_marex');
var masterFields = Alloy.createCollection('master_field');
var marexs = Alloy.createCollection('marex');

Ti.API.info('args, mainview, ' + JSON.stringify(args));

init();

function init() {
	$.main.title = "Bucket - " + args.properties.cdlevel; 
	
	//cek last update, if last update > 10 minute,
	//cek internet Connection, if available, do sync

	Ti.API.info('isInternetAvailable', isInternetAvailable());
	Ti.API.info('intervalUpdate' + intervalUpdate());
	if (isInternetAvailable()) {
		if (intervalUpdate() > 600) {

			//sync all data from server
			loadDataBucket(true);

			//save last sync
			saveLastUpdate();
		} else {
			//load local data
			loadDataBucket(false);
		}
	} else {
		//load local data
		loadDataBucket(false);
	}
}

function loadMarexData(isSync) {
	if (isSync) {
		Ti.API.info('marex, from file/ http request');
		var param = {
			noreg : noregs
		};

		marexLib.getDataTrnMarex(param, function(isSuccess) {
			if (isSuccess) {
				Ti.API.info('marex, load, success');
				getAllNoField();
				loadMasterFieldData(true);
			} else {
				Ti.API.info('marex, load, failed');
			}
		});
	}
}

function loadMasterFieldData(isSync) {
	if (isSync) {
		Ti.API.info('mst field, from file/http request');

		var param = {
			nofield : nofields
		};

		masterField.loadMasterFieldData(param, function(isSuccess) {
			if (isSuccess) {
				Ti.API.info('mstField, load, success');
			} else {
				Ti.API.info('mstField, load, failed');
			}
		});
	}
}

//save all no_field
var nofields = [];

function getAllNoField() {
	Ti.API.info('getAllNoField');
	var marex = Alloy.createModel('marex', null);
	var temp = [];
	marexs.fetch();
	marexs.map(function(marex) {
		Ti.API.info('masterfield nofield,' + marex.get('NO_FIELD'));
		temp.push({
			nofield : marex.get('NO_FIELD')
		});
	});
	nofields = temp;
}

//save all no_reg
var noregs = [];

//collect all no_reg
function getAllNoReg() {
	//get all no registration number from data bucket

	var bucketMarex = Alloy.createModel('bucket_marex', null);
	var temp = [];
	bucketMarexs.map(function(bucketMarex) {
		temp.push({
			noreg : bucketMarex.get("NO_REGISTRATION")
		});
	});
	noregs = temp;
	Ti.API.info('noregs, length, ' + noregs.length);
}

function loadLoanData(isSync) {
	if (isSync) {
		Ti.API.info('loan, from file/ http request');

		var param = {
			noaggr : noregs,
			cdsp : Ti.App.Properties.getString('cdsp', null),
		};
		Ti.API.info('loan, cdsp, ' + param.cdsp);
		loanLib.loadLoanData(param, function(isSuccess) {
			if (isSuccess) {
				Ti.API.info('loan, load, success');
			} else {
				Ti.API.info('loan, load, failed');
			}
		});
	}
}

function loadDataCustomer(isSync) {
	if (isSync) {
		Ti.API.info('customer, from file/ http request');
		//load data cust
		custLib.loadCustData(noregs, function(isSuccess) {
			if (isSuccess) {
				Ti.API.info('Load, customer, success');
			} else {
				Ti.API.info('Load, customer, failed');
			}
		});
	} else {
		Ti.API.info('customer, persistent, nothing to do');
	}
}

function loadDataLevel(isSync) {
	if (isSync) {
		Ti.API.info('level, from file/ http request');
		//load data level
		var param = {
			cdsp : Ti.App.Properties.getString('cdsp', null),
			flagactive : 'Y'
		};
		levelLib.loadLevelMarexData(param, function(isSuccess) {
			if (isSuccess) {
				Ti.API.info('Load, level, success');
			} else {
				Ti.API.info('Load, level, failed');
			}
		});
	} else {
		Ti.API.info('customer, persistent, nothing to do');
	}
}

function loadDataBucket(isSync) {

	if (isSync) {
		var param = {
			type_s : "Q",
			cd_sp : Ti.App.Properties.getString('cdsp', null)
		};

		Ti.API.info('data bucket, from file/ http request');
		bucketMarexLib.loadBucketMarexData(param, function(isSuccess) {
			if (isSuccess) {
				//setTimeout(bindListRegistrasi(), 2000);
				bindListRegistrasi();
				Ti.API.info('bucket, load, successed');

				//load all data
				getAllNoReg();
				loadDataCustomer(true);
				loadLoanData(true);
				loadDataLevel(true);
				loadMarexData(true);
			} else {
				Ti.API.info('bucket, load, failed');
			}
		});
	} else {
		Ti.API.info('data bucket, load from persistent storage');
		bindListRegistrasi();
	}
}

function bindListRegistrasi() {
	var _bucketMarexs = [];
	var bucketMarex = Alloy.createModel('bucket_marex', null);
	bucketMarexs.fetch();
	Ti.API.info('bind, bucket');
	bucketMarexs.map(function(bucketMarex) {

		Ti.API.info('bind, bucket, noreg, ' + bucketMarex.get('NO_REGISTRATION'));
		var bgColor = '';
		if (bucketMarex.get('STATUS') === 'O') {
			bgColor = "#FFFFFF";
		} else {
			bgColor = "#BFBFBF";
		}

		_bucketMarexs.push({
			template : 'listRegistrasiTemp',
			searchableText : bucketMarex.get('NO_REGISTRATION'),
			lblNoReg : {
				text : bucketMarex.get('NO_REGISTRATION'),
				width : Ti.UI.FILL,
				textAlign : 'right'
			},
			lblL1 : {
				text : bucketMarex.get('L1_USER') + "/" + bucketMarex.get('L1_DATE') + " - " + bucketMarex.get('L1_TIME') + "/" + bucketMarex.get('L1_RESULT') + "/" + bucketMarex.get('L1_LEVEL'),
			},
			lblL2 : {
				text : bucketMarex.get('L2_USER') + "/" + bucketMarex.get('L2_DATE') + " - " + bucketMarex.get('L2_TIME') + "/" + bucketMarex.get('L2_RESULT') + "/" + bucketMarex.get('L2_LEVEL'),
			},
			lblL3 : {
				text : bucketMarex.get('L3_USER') + "/" + bucketMarex.get('L3_DATE') + " - " + bucketMarex.get('L3_TIME') + "/" + bucketMarex.get('L3_RESULT') + "/" + bucketMarex.get('L3_LEVEL'),
			},
			viewListRegistrasi : {
				backgroundColor : bgColor,
			},
			properties : {
				noreg : bucketMarex.get('NO_REGISTRATION'),
				searchableText : bucketMarex.get('NO_REGISTRATION')
			}
		});
	});
	$.listRegistrasi.sections[0].items = _bucketMarexs;
}

function isInternetAvailable() {
	if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
		return false;
	} else {
		return true;
	}
}

function intervalUpdate() {
	var lastUpdate = Ti.App.Properties.getDouble('lastUpdate', 0);
	var dateNow = new Date();

	var interval = (dateNow.getTime() - lastUpdate) / 1000;
	return interval;
}

function saveLastUpdate() {
	//save nowDate as lastUpdate
	var nowDate = new Date();
	Ti.App.Properties.setDouble('lastUpdate', nowDate.getTime());

}

function clickRegistrasi(e) {
	var section = $.listRegistrasi.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);

	var detail = Alloy.createController("detail", item).getView();
	detail.open();
}

function logOut(e) {
	var login = Alloy.createController('index').getView();
	login.open();
	$.main.close();
	//clear all persistent storage
	Ti.App.Properties.setDouble('lastUpdate', 0);
	Ti.App.Properties.setBool('keeplogin', false);
}

function chPass(e) {
	// ini tempat untuk ganti password
}

function sync(e){
	//sync all
	//update marex to server
	//update bucketMarex to server
	//update userPassword to server
	//delete all table
	//retrieve all data from server
}
// $.main.addEventListener('android:back', function(e) {
// // $.menuItem.
// });
