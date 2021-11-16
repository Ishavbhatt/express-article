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

// Create new Article
router.post("/", auth.checkUserLogin, (req, res)=>{
    console.log(req.body);
    req.body.authorId = req.user.id;
    Article.create(req.body, (err, articlelist)=>{        
        if(err) return res.json({err})
        res.redirect("/articles");
    })
});

// Like a article
router.get("/:id/like", (req, res) => {
   Article.findByIdAndUpdate(req.params.id, {$inc: {likes: 1}}, (err, article) => {
      res.redirect('/articles/' + req.params.id);
   })
});

// Edit a Article
router.get('/:id/edit', auth.checkUserLogin,  (req, res)=>{
    Article.findById(req.params.id, (err, article) =>{
        if(req.user._id.equals(article.authorId)) {
            Article.findById(req.params.id, (err, article)=>{
                if (err) return res.json({err});
                res.render('editarticle', {article});
            });
        } else {
            res.send("Not Allowed");
        }
    });
});

// Update a Article
router.post("/:id", auth.checkUserLogin, (req, res)=>{
	Article.findByIdAndUpdate(req.params.id, req.body, (err, updatedArticle)=>{
		if (err) return res.json({err})
			res.redirect("/articles");
	});
});

// Lists of MY Articles
router.get("/mylists", auth.checkUserLogin, (req, res) =>{
        Article.find({authorId: req.user.id}, (err, articles)=>{
            if (err) res.json({err});
            res.render('myarticles', {articles});
        });
});

// Shows article with all comments
router.get('/:id/singlearticle', (req, res)=>{
    Article.findById(req.params.id).populate('authorId', "name email").exec( (err, article)=>{
        Comment.find({articleId: req.params.id}).populate('author', "name").exec( (err, comments)=>{
            res.render("singlearticle", {article:article, comments:comments})
        });
    });
});

// Delete Article
router.get('/:id/delete', auth.checkUserLogin, (req, res) =>{
    Article.findById(req.params.id, (err, user)=>{
        if(req.user._id.equals(user.authorId)) {
            Article.findByIdAndRemove(req.params.id, (err,user)=>{
                if (err) return res.json({err});
                res.redirect("/articles/");
            });
        } else {
            res.send("Not Allowed");
        }
    });
});



module.exports = router;

