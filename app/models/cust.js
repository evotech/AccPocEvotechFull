exports.definition = {
	config: {
		columns: {
		    "NO_REGISTRATION": "string",
		    "FLAG_PC": "string",
		    "FLAG_BCG": "string",
		    "NO_G": "string",
		    "CD_CUSTOMER": "string",
		    "CD_CUST_SPECIAL": "string",
		    "CD_TITLE": "string",
		    "NAME": "string",
		    "LN_REST_ADDR1": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "cust"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};