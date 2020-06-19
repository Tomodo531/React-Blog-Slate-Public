const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		media: { type: String },
		content: { type: String, required: true },
		pined: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true
	}
);

const Post = mongoose.model('BlogPost', postSchema);

module.exports = Post;
