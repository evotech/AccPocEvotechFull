exports.definition = {
	config: {
		columns: {
		    "NO_REGISTRATION": "string",
		    "NO_SR": "string",
		    "NO_FIELD": "string",
		    "CD_SUB_FIELD": "string",
		    "VALUE_STANDAR": "string",
		    "VALUE_ACTUAL": "string",
		    "VALUE_DEVIASI": "string",
		    "FLAG_DEVIASI": "string",
		    "STATUS": "string",
		    "NUM_STANDAR": "string",
		    "NUM_ACTUAL": "string",
		    "NUM_DEVIASI": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "marex"
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