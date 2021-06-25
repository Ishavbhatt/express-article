var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	likes: {
		type: Number,
		default: 0
	},
	authorId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	created_at: { 
		type: Date,
		default: Date.now
	 }
}, {timestams: true})

var Article = mongoose.model("Article", articleSchema);
module.exports = Article;