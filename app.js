var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require ('express-session');
var MongoStore = require('connect-mongo')(session);
// var Article = require('./models/article');
// var Comment = require('./models/comment');
// var User = require('./models/user');
var auth = require('./middleware/auth');

var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
var commentsRouter = require('./routes/comments');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect("mongodb://localhost/express-article",
  {
     useNewUrlParser: true,
     useUnifiedTopology: true
  },(err)=>{
     err ? console.log(err) : console.log("Connected to DB")
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
mongoose.set('useCreateIndex', true);
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'qwerty',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// middleware
app.use(auth.getUserInfo)



app.use('/', indexRouter);
app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;