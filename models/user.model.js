const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

const User = mongoose.model('BlogUser', UserSchema);

module.exports = User;
