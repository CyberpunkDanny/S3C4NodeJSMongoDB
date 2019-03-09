/* This file is store authentication strategies */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

/* Configuring passport with localstrategy */

exports.local = passport.use(new LocalStrategy(User.authenticate()));
/* LocalStrategy() takes a 'verfiyFunc()' as parameter which is automatically provided by passport-local-mongoose */
/* This 'verifyFunc()' is called with the username and password that passport will extract from our incoming request */

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/* To support sessions in passport */