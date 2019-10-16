var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Comment = require('../models/comment');
var auth = require('../middleware/auth');


// Lists of Articles
router.get("/", (req, res)=>{
    Article.find({}, (err, articlelist)=>{
		if(err) return res.json({err});
		res.render('articles', {articlelist});
    });
});

// Render article form
router.get("/add", auth.checkUserLogin, (req, res) => {
    res.render("addform");
});

// Lists of Articles
router.post("/", auth.checkUserLogin, (req, res)=>{
    console.log(req.body);
    req.body.authorId = req.user.id;
    Article.create(req.body, (err, articlelist)=>{
        console.log(err, articlelist);
        if(err) return res.json({err})
        res.redirect("/articles");
    })
});

// Edit a Article
router.get('/:id/edit', auth.checkUserLogin,  (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        if (err) return res.json({err});
        res.render('editarticle', {article});
    })
})

// Update a Article
router.post("/:id", auth.checkUserLogin, (req, res)=>{
	Article.findByIdAndUpdate(req.params.id, req.body, (err, updatedArticle)=>{
		console.log(req.body);
		if (err) return res.json({err})
			res.redirect("/articles");
	});
});

// Shows article with all comments
router.get('/:id', (req, res)=>{
    Article.findById(req.params.id).populate('authorId', "name email").exec( (err, article)=>{
        Comment.find({articleId: req.params.id}).populate('author', "name").exec( (err, comments)=>{
            console.log(article)
            res.render("singlearticle", {article:article, comments:comments})
        });
    });
});

// Delete Article
router.get('/:id/delete', auth.checkUserLogin, (req, res) =>{
    Article.findByIdAndRemove(req.params.id, (err,user)=>{
        if (err) return res.json({err});
        res.redirect("/articles/");
    });
});

module.exports = router;

