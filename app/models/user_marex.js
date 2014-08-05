exports.definition = {
	config: {
		columns: {
		    "CD_LEVEL": "string",
		    "ID_USER": "string",
		    "CD_SP": "int",
		    "FLAG_ACTIVE": "string",
		    "EMAIL_ADDR": "string",
		    "NO_HP": "string",
		    "BRAND_ASTRA": "string",
		    "FLAG_NEW_USED": "string",
		    "NO_SR": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "user_marex"
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