exports.definition = {
	config : {
		columns : {
			"NO_AGGR" : "text",
			"NO_REGISTRATION" : "text",
			"ST_AGGR" : "text",
			"CD_FUNDING_COMP" : "text",
			"CD_SP" : "text",
			"TENOR" : "text",
			"DT_GOLIVE" : "text",
			"CD_SALESMAN" : "text",
			"TYPE_LOAN" : "text",
			"TYPE_PAYMENT_MODE" : "text",
			"PAYMENT_FREQ" : "text",
			"AMT_DOWNPAYMENT" : "text",
			"AMT_LOAN" : "double",
			"AMT_TOT_PRIN" : "double",
			"AMT_TOT_INT" : "double",
			"AMT_TOT_PRIN_PAID" : "double",
			"AMT_TOT_INT_PAID" : "double",
			"AMT_PENALTY" : "double",
			"AMT_PENALTY_PAID" : "double",
			"AMT_OVERDUE" : "double",
			"AMT_OTR" : "double",
			"AMT_ADMIN_FEE" : "double",
			"AMT_INSTALLMENT" : "double",
			"DT_DUE_INST" : "text",
			"DT_PREPAY" : "text",
			"TYPE_INSTALLMENT" : "text",
			"DT_APPL" : "text",
			"CD_SP_COLL" : "text",
			"AMT_TOT_PENALTY" : "text"
		},
		adapter : {
			type : "sql",
			collection_name : "loan"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
}; 