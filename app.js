var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
// const session = require('express-session');
const session = require('cookie-session');
const compression = require('compression');
const helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const messageRouter = require('./routes/message');

var app = express();

// Protect from web vulnerabilities with Helmet.
app.use(helmet());

// Mongoose connection setup
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Compress HTTP response with compression
app.use(compression());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.session());

// Passport initialization
app.use(passport.initialize());

// Set locals object with the current logged in user
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.isLoggedIn = req.isAuthenticated();
  if (req.user) {
    res.locals.isMember = req.user.member_status === 'member';
    res.locals.isAdmin = req.user.member_status === 'admin';
  }
  next();
});

// Routes setup
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', messageRouter);
app.use('/', usersRouter);

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
