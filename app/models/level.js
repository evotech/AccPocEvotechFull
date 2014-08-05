exports.definition = {
	config: {
		columns: {
		    "CD_SP": "text",
		    "NO_LEVEL" : "text",
		    "CD_LEVEL" : "text",
		    "DESC_LEVEL" : "text",
		    "CD_ALIAS" : "text",
		    "FLAG_ACTIVE" : "text",
		    "FLAG_PRINT" : "text",
		    "FLAG_MAIL" : "text",
		    "FLAG_SMS" : "text",
		},
		adapter: {
			type: "sql",
			collection_name: "level"
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