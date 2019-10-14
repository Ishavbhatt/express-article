var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');



router.post('/', (req, res)=>{
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
router.get('/:id/edit', (req, res)=>{
	if (req.session && req.session.userid) {
		Comment.findById(req.params.id, (err, comment) => {
			if (err) return res.json({err});
			res.render("editcomment", {comment:comment});
		});
	} else {
		res.redirect("/users/login");
	}
});

// Update comment
router.post('/:id/update', (req, res) => {
	Comment.findByIdAndUpdate(req.params.id, req.body, (err, updatedcomment) => {
		if (err) return res.json(err);
		res.redirect("/articles/" + updatedcomment.articleId);
	});
});

// Delete comment
router.get('/:id/delete', (req, res) =>{
	if (req.session && req.session.userid) {
		Comment.findByIdAndRemove(req.params.id, (err, comment) => {
			if(err) return res.json({err});
			res.redirect("/articles/" + comment.articleId);
		});
	} else {
		res.redirect("/users/login");
	}
});


module.exports = router;
