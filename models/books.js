let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookSchema = new Schema({
	bookInfo: {
		type: Object
	},
	ownedBy: {
		type: String
	},
	requiredBy: {
		type: String,
		default: ''
	},
	status: {
		type: String,
		default: 'listed'
	}
});

module.exports = mongoose.model('Book', bookSchema);
