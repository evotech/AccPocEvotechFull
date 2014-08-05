exports.definition = {
	config: {
		columns: {
		    "NO_REGISTRATION": "string",
		    "CD_SP": "string",
		    "L1_USER": "string",
		    "L1_DATE": "string",
		    "L1_TIME": "string",
		    "L1_RESULT": "string",
		    "L1_LEVEL": "string",
		    "L2_USER": "string",
		    "L2_DATE": "string",
		    "L2_TIME": "string",
		    "L2_RESULT": "string",
		    "L2_LEVEL": "string",
		    "L3_USER": "string",
		    "L3_DATE": "string",
		    "L3_TIME": "string",
		    "L3_RESULT": "string",
		    "L3_LEVEL": "string",
		    "STATUS": "string",
		    "BRAND_ASTRA": "string",
		    "FLAG_NEW_USED": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "bucket_marex"
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