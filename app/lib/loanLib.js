exports.loadLoanData = function(param, callback) {
	createLoanTable();
	delLoanRecords();

	for (var i = 0; i < param.noaggr.length; i++) {
		Ti.API.info('param, noaggr, ' + param.noaggr[i].noreg);
		getLoanHTTP(param.noaggr[i].noreg, param.cdsp, callback);
	}

	// var isSuccess = true;
	// callback(isSuccess);
};

function getLoan(param) {
	var json = loadFile();

	Ti.API.info('loan, file: \n' + JSON.stringify(json));

	var _noregs = param.noaggr;
	for (var j = 0; j < _noregs.length; j++) {
		var noaggr = '01' + _noregs[j].noreg;
		for (var i = 0; i < json.length; i++) {
			if (json[i].NO_AGGR === noaggr && json[i].CD_SP === param.cdsp) {
				var _loan = Alloy.createModel('loan', {
					NO_AGGR : json[i].NO_AGGR,
					NO_REGISTRATION : json[i].NO_REGISTRATION,
					ST_AGGR : json[i].ST_AGGR,
					CD_FUNDING_COMP : json[i].CD_FUNDING_COMP,
					CD_SP : json[i].CD_SP,
					TENOR : json[i].TENOR,
					DT_GOALIVE : json[i].DT_GOLIVE,
					CD_SALESMAN : json[i].CD_SALESMAN,
					TYPE_LOAN : json[i].TYPE_LOAN,
					TYPE_PAYMENT_MODE : json[i].TYPE_PAYMENT_MODE,
					PAYMENT_FREQ : json[i].PAYMENT_FREQ,
					AMT_DOWNPAYMENT : json[i].AMT_DOWNPAYMENT,
					AMT_LOAN : json[i].AMT_LOAN,
					AMT_TOT_PRIN : json[i].AMT_TOT_PRIN,
					AMT_TOT_INT : json[i].AMT_TOT_INT,
					AMT_TOT_PRIN_PAID : json[i].AMT_TOT_PRIN_PAID,
					AMT_TOT_INT_PAID : json[i].AMT_TOT_INT_PAID,
					AMT_PENALTY : json[i].AMT_PENALTY,
					AMT_PENALTY_PAID : json[i].AMT_PENALTY_PAID,
					AMT_OVERDUE : json[i].AMT_OVERDUE,
					AMT_OTR : json[i].AMT_OTR,
					AMT_ADMIN_FEE : json[i].AMT_ADMIN_FEE,
					AMT_INSTALLMENT : json[i].AMT_INSTALLMENT,
					DT_DUE_INST : json[i].DT_DUE_INST,
					DT_REPAY : json[i].DT_PREPAY,
					TYPE_INSTALLMENT : json[i].TYPE_INSTALLMENT,
					DT_APPL : json[i].DT_APPL,
					CD_SP_COLL : json[i].CD_SP_COLL,
					AMT_TOT_PENALTY : json[i].AMT_TOT_PENALTY
				});
				//save to persistent
				_loan.save();
				Ti.API.info('loan, save');
			} else {
				Ti.API.info('loan, next');
			}
		}
	}

}

function getLoanHTTP(noaggr, cdsp, callback) {
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);

	// Define the callback.
	anXhr.onload = function() {
		// Handle the XML data.
		Ti.API.info('loanlib, onload, ' + noaggr);
		Ti.API.info("response Text: " + this.responseText);

		var json = JSON.parse(this.responseText);

		for (var i = 0; i < json.length; i++) {
			var _loan = Alloy.createModel('loan', {
				NO_AGGR : json[i].NO_AGGR,
				NO_REGISTRATION : json[i].NO_REGISTRATION,
				ST_AGGR : json[i].ST_AGGR,
				CD_FUNDING_COMP : json[i].CD_FUNDING_COMP,
				CD_SP : json[i].CD_SP,
				TENOR : json[i].TENOR,
				DT_GOALIVE : json[i].DT_GOLIVE,
				CD_SALESMAN : json[i].CD_SALESMAN,
				TYPE_LOAN : json[i].TYPE_LOAN,
				TYPE_PAYMENT_MODE : json[i].TYPE_PAYMENT_MODE,
				PAYMENT_FREQ : json[i].PAYMENT_FREQ,
				AMT_DOWNPAYMENT : json[i].AMT_DOWNPAYMENT,
				AMT_LOAN : json[i].AMT_LOAN,
				AMT_TOT_PRIN : json[i].AMT_TOT_PRIN,
				AMT_TOT_INT : json[i].AMT_TOT_INT,
				AMT_TOT_PRIN_PAID : json[i].AMT_TOT_PRIN_PAID,
				AMT_TOT_INT_PAID : json[i].AMT_TOT_INT_PAID,
				AMT_PENALTY : json[i].AMT_PENALTY,
				AMT_PENALTY_PAID : json[i].AMT_PENALTY_PAID,
				AMT_OVERDUE : json[i].AMT_OVERDUE,
				AMT_OTR : json[i].AMT_OTR,
				AMT_ADMIN_FEE : json[i].AMT_ADMIN_FEE,
				AMT_INSTALLMENT : json[i].AMT_INSTALLMENT,
				DT_DUE_INST : json[i].DT_DUE_INST,
				DT_REPAY : json[i].DT_PREPAY,
				TYPE_INSTALLMENT : json[i].TYPE_INSTALLMENT,
				DT_APPL : json[i].DT_APPL,
				CD_SP_COLL : json[i].CD_SP_COLL,
				AMT_TOT_PENALTY : json[i].AMT_TOT_PENALTY
			});
			//save to persistent
			_loan.save();
			Ti.API.info('loan, save');
		};

		callback(true);

	};
	anXhr.onerror = function() {
		setTimeout(function() {
			getLoanHTTP(noaggr, cdsp, callback);
		}, 500);
		Ti.API.info('The HTTP request failed');
	};
	// Send the request data.
	anXhr.open('POST', 'http://172.16.4.111/pocmobile/mstLoanAccount.php');
	anXhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	var param = {
		"no_aggr" : '01' + noaggr,
		"cd_sp" : cdsp
	};
	anXhr.send(JSON.stringify(param));
};

function delLoanRecords() {
	var db = Ti.Database.open('_alloy_');
	var deleteRecord = db.execute('DELETE FROM loan');
	Ti.API.info('Affected rows : ' + db.getRowsAffected());
	db.close();
}

function createLoanTable() {
	var db = Ti.Database.open('_alloy_');
	db.execute('CREATE TABLE IF NOT EXISTS loan (alloy_id TEXT, ' + 'NO_AGGR TEXT, ' + 'NO_REGISTRATION TEXT, ST_AGGR TEXT, CD_FUNDING_COMP TEXT, ' + 'CD_SP TEXT, TENOR TEXT, DT_GOLIVE TEXT, CD_SALESMAN TEXT, TYPE_LOAN TEXT, ' + 'TYPE_PAYMENT_MODE TEXT, PAYMENT_FREQ TEXT, AMT_DOWNPAYMENT TEXT, AMT_LOAN DOUBLE,' + 'AMT_TOT_PRIN DOUBLE, AMT_TOT_INT DOUBLE, AMT_TOT_PRIN_PAID DOUBLE, AMT_TOT_INT_PAID DOUBLE,' + 'AMT_PENALTY DOUBLE, AMT_PENALTY_PAID DOUBLE, AMT_OVERDUE DOUBLE, AMT_OTR DOUBLE,' + 'AMT_ADMIN_FEE DOUBLE, AMT_INSTALLMENT DOUBLE, DT_DUE_INST TEXT, DT_PREPAY TEXT, ' + 'TYPE_INSTALLMENT TEXT,' + 'DT_APPL TEXT, CD_SP_COLL TEXT, AMT_TOT_PENALTY TEXT);');
	db.close();
}

function loadFile() {
	var filename = "loanData.json";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + filename);

	var preParseData = (file.read().text);
	return JSON.parse(preParseData);
}
