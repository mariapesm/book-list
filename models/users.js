let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	address: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	wishedItemsNum: {
		type: Number,
		default: 0
	}
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
