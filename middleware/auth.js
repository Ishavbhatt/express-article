var User = require('../models/user');

exports.checkUserLogin = (req, res, next) => {
    if (req.session && req.session.userid) {
        next() // allow to procced
    } else {
        res.redirect('/users/login');
    }
}

exports.getUserInfo = (req, res, next) => {
    if (req.session && req.session.userid) {
        User.findById(req.session.userid, (err, user) => {
            if(err) return next(err);
            req.user = user;
            res.locals.user = user;
            next();
        })
    } else {
        req.user = null;
        res.locals.user = null;
        next()
    }
}