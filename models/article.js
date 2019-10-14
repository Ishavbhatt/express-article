var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: String,
	description: String,
	likes: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, {timestams: true})

var Article = mongoose.model("Article", articleSchema);
module.exports = Article;