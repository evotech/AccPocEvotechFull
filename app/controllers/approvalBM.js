var args = arguments[0] || {};

//collection
var marexs = Alloy.createCollection('marex');
var mstFields = Alloy.createCollection('master_field');

Ti.API.info('args, marex,' + JSON.stringify(args));

bindDataApproval(args);

function cekLevelDeviasi(nofield, valueDeviasi) {
	var defaultField = [175, 176, 182];
	var target = ['BM', 'RRSH', 'RRSDH', 'RROH'];

	Ti.API.info('cek, nofield, ', nofield);
	Ti.API.info('cek, valDeviasi ', valueDeviasi);

	// if (parseInt(nofield) === defaultField[0]) {
	// if (valueDeviasi >= -2 && valueDeviasi <= 0) {
	// level = target[0];
	// } else if (valueDeviasi >= -5 && valueDeviasi <= -2) {
	// level = target[1];
	// }
	// Ti.API.info('175, level : ' + level);
	//	} else if (parseInt(nofield) === defaultField[1]) {
	var level;

	if (valueDeviasi >= -10 && valueDeviasi <= 0) {
		level = target[0];
	} else if (valueDeviasi >= -20 && valueDeviasi < -10) {
		level = target[1];
	} else if (valueDeviasi > -20) {
		level = target[2];
	} else {
		level = target[3];
	}
	Ti.API.info('176, level : ' + level);

	// } else if (parseInt(nofield) === defaultField[2]) {
	// if (valueDeviasi >= 0 && valueDeviasi <= 5) {
	// level = target[0];
	// } else if (valueDeviasi >= 5 && valueDeviasi <= 10) {
	// level = target[3];
	// }
	// Ti.API.info('182, level : ' + level);
	// } else {
	// Ti.API.info('level else: ' + level);
	// }

	return level;
}

function bindDataApproval(noreg) {
	marexs.fetch({
		query : 'SELECT * FROM marex WHERE NO_REGISTRATION="' + noreg + '"'
	});

	var marex = Alloy.createModel('marex', null);
	var item = [];
	marexs.map(function(marex) {

		var lv = cekLevelDeviasi(marex.get('NO_FIELD'), marex.get('VALUE_DEVIASI'));

		var flDevColor = '#000000';
		if (marex.get('FLAG_DEVIASI') === 'Y') {
			flDevColor = '#ff0000';
		}

		//cek current level user
		var show = false;
		var userLv = Ti.App.Properties.getString('cdlevel', null);

		Ti.API.info('userLv,' + userLv);
		if (userLv === 'BM') {
			show = true;
		} else if (userLv === 'RRSH') {
			if (lv !== 'BM') {
				show = true;
			} else {
			}
		} else if (userLv === 'RRSDH') {
			if (lv === 'RRSDH') {
				show = true;
			} else {
			}
		} else {
		}

		//get cd subfield from database
		var cdSubField;

		if (show) {
			Ti.API.info('marex, load');
			item.push({
				template : 'templates',
				// level : {
				// text : lv,
				// },
				noreg : {
					text : marex.get('NO_REGISTRATION')
				},
				nosr : {
					text : marex.get('NO_SR')
				},
				nofield : {
					text : marex.get('NO_FIELD')
				},
				cdsubfield : {
					text : marex.get('CD_SUB_FIELD')
				},
				valstandar : {
					text : marex.get('VALUE_STANDAR')
				},
				valactual : {
					text : marex.get('VALUE_ACTUAL')
				},
				valdeviasi : {
					text : marex.get('VALUE_DEVIASI'),
					color : flDevColor
				},
				// flagdeviasi : {
				// text : marex.get('FLAG_DEVIASI')
				// },
				status : {
					text : marex.get('STATUS')
				},
				switchApproval : {
					value : true,
				},
				lblApproval : {
					text : "Approve"
				},
				// numstandar : {
				// text : marex.get('NUM_STANDAR')
				// },
				// numactual : {
				// text : marex.get('NUM_ACTUAL')
				// },
				// numdeviasi : {
				// text : marex.get('NUM_DEVIASI')
				// },

				properties : {
					alloyId : marex.get('alloy_id'),
					noField : marex.get('NO_FIELD'),
					noReg : marex.get('NO_REGISTRATION'),
					level : lv,
				}
			});

		} else {
		}

	});
	$.listParameter.sections[0].items = item;
}

function submit() {
	//getAllValue of approval
	var lengthOfListParam = $.listParameter.sections[0].getItems().length;

	var tempColl = Alloy.createCollection('marex', null);
	var userLv = Ti.App.Properties.getString('cdlevel', null);

	for (var i = 0; i < lengthOfListParam; i++) {
		var item = $.listParameter.sections[0].getItemAt(i);
		Ti.API.info('item - ' + i + ' - ' + JSON.stringify(item));

		var status = "O";
		if (item.switchApproval.value === true) {
			if (item.properties.level === userLv) {
				status = "A";
			} else {
				status = "O";
			}
		} else {
			status = "R";
		}

		//create object marex for each item
		//save to temp collection
		//pass to viewReason
		var tempModel = Alloy.createModel('marex', {
			STATUS : status,
			NO_FIELD : item.properties.noField,
			NO_REGISTRATION : item.properties.noReg,
			alloy_id : item.properties.alloyId,
		});
		Ti.API.info('tempModel, ' + JSON.stringify(tempModel));
		tempColl.add(tempModel);
	}

	createReasonView(tempColl);
}

function createReasonView(updateMarexCollection) {
	var viewReason = Alloy.createController('viewReason', updateMarexCollection).getView();
	viewReason.open();
}

function onParamClick(e) {

}

function onChangeSwitchApproval(e) {

	var section = $.listParameter.sections[e.sectionIndex];
	var item = section.getItemAt(e.itemIndex);

	Ti.API.info(JSON.stringify(item));
	if (item.switchApproval.value === true) {
		item.lblApproval.text = "Reject";
		item.switchApproval.value = false;
		item.status.text = 'R';
	} else {
		item.lblApproval.text = "Approve";
		item.switchApproval.value = true;
		item.status.text = 'A';
	}
	section.updateItemAt(e.itemIndex, item);
}
