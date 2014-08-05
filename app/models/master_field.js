exports.definition = {
	config: {
		columns: {
		    "NO_FIELD" : "text",
		    "DESC_FIELD" : "text",
		    "FLAG_ACTIVE" : "text",
		    "CD_FIELD" : "text",
		    "CD_SP" : "text",
		    "CD_SP_COLL" : "text"
		},
		adapter: {
			type: "sql",
			collection_name: "master_field"
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