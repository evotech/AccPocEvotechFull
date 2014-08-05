var args = arguments[0] || {};

//collection
var custs = Alloy.createCollection('cust');
var loans = Alloy.createCollection('loan');

bindDataCust(args.properties.noreg);
bindDataLoan(args.properties.noreg);

function bindDataCust(noreg) {

	Ti.API.info('bind, cust, noreg, ' + noreg);
	custs.fetch({
		query : 'SELECT * FROM cust WHERE NO_REGISTRATION="' + noreg + '"'
	});

	var cust = Alloy.createModel('cust', null);
	custs.map(function(cust) {

		Ti.API.info('bind, cust, noreg, ' + cust.get('NO_REGISTRATION'));

		$.lblNoReg.text = cust.get('NO_REGISTRATION');
		$.lblFlagPc.text = cust.get('FLAG_PC');
		$.lblFlagBcg.text = cust.get('FLAG_BCG');
		$.lblNoG.text = cust.get('NO_G');
		$.lblCdCust.text = cust.get('CD_CUST');
		$.lblCdCustSpecial.text = cust.get('CD_CUST_SPECIAL');
		$.lblCdTitle.text = cust.get('CD_TITLE');
		$.lblName.text = cust.get('NAME');
		$.lblAddr.text = cust.get('LN_RESI_ADDR1');
	});
}

function bindDataLoan(noreg) {
	loans.fetch({
		query : 'SELECT * FROM loan WHERE NO_REGISTRATION = "' + noreg + '"'
	});

	var loan = Alloy.createModel('loan', null);

	loans.map(function(loan) {
		$.lblAggrLoan.text = loan.get('NO_AGGR');
		$.lblNoRegLoan.text = loan.get('NO_REGISTRATION');
		$.lblStAggrLoan.text = loan.get('ST_AGGR');
		$.lblCdFundingCompLoan.text = loan.get('CD_FUNDING_COMP');
		$.lblCdSpLoan.text = loan.get('CD_SP');
		$.lblTenorLoan.text = loan.get('TENOR');
		$.lblDtGoLiveLoan.text = loan.get('DT_GOLIVE');
		$.lblCdSalesmanLoan.text = loan.get('CD_SALESMAN');
		$.lblTypeLoan.text = loan.get('TYPE_LOAN');
		$.lblTypePaymentMode.text = loan.get('TYPE_PAYMENT_MODE');
		$.lblPaymentFreq.text = loan.get('PAYMENT_FREQ');
		$.lblAmtDownPayment.text = loan.get('AMT_DOWNPAYMENT');
		$.lblAmtLoan.text = loan.get('AMT_LOAN');
	});
}

function clickProcess(e) {
	var noreg = args.properties.noreg;
	var approval = Alloy.createController("approvalBM", noreg).getView();
	approval.open();
}

