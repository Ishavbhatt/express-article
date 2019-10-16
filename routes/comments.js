var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var auth = require('../middleware/auth');




router.post('/', (req, res)=>{
	req.body.author = req.user.id;
	if (req.session && req.session.userid) {
		Comment.create(req.body, (err, comment)=>{
			if (err) return res.json({ err });
				res.redirect("/articles/" + comment.articleId);
		});
	} else {
		res.redirect("/users/login");
	}
});

// Edit comment
router.get('/:id/edit', auth.checkUserLogin, (req, res)=>{
	Comment.findById(req.params.id, (err, comment) =>{
		if(req.user._id.equals(comment.author)) {
			Comment.findById(req.params.id, (err, comment) => {
				if (err) return res.json({err});
				res.render("editcomment", {comment:comment});
			});
		} else {
			res.send("You Are Not Authorised");
		}
	});
});

// Update comment
router.post('/:id/update', (req, res) => {
	Comment.findByIdAndUpdate(req.params.id, req.body, (err, updatedcomment) => {
		if (err) return res.json(err);
		res.redirect("/articles/" + updatedcomment.articleId);
	});
});

// Delete comment
router.get('/:id/delete', auth.checkUserLogin, (req, res) => {
	Comment.findById(req.params.id, (err, comment) => {
		console.log(req.user.id, comment.author, req.user.id.toString() === comment.author.toString(), typeof req.user.id)
		if(req.user._id.equals(comment.author)) {
			Comment.findByIdAndRemove(req.params.id, (err, comment) => {
				if(err) return res.json({err});
				res.redirect("/articles/" + comment.articleId);
			});
		} else {
			res.send("Not Allowed");
		}
	});
});


module.exports = router;
