var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Registeration form
router.get('/register', (req, res) =>{
    res.render('registerform');
});

// Registered user
router.post('/register', (req, res) =>{
    User.create(req.body, (err, createduser) =>{
        if (err) return res.json({ err });
        res.redirect('/users/login');
    });
});

// User Login
router.get('/login', (req, res) =>{
    res.render('loginform');
});

// Logged in
router.post("/login", (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, user)=>{
        console.log(user);
		if(err) return next(err);
		if(!user) return res.send('Enter valid email');
		if(!user.matchPassword(req.body.password)){ 
			res.send('Incorrect password');
        
        };
        req.session.userid = user.id; // creating session
        console.log(req.session);
		res.redirect("/articles/");
	});
});

// Logout
router.get('/logout',function(req,res){    
    req.session.destroy() 
    res.redirect('/users/login');   
});  


module.exports = router;