/* This file is store authentication strategies */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

/* Configuring passport with localstrategy */

exports.local = passport.use(new LocalStrategy(User.authenticate()));
/* LocalStrategy() takes a 'verfiyFunc()' as parameter which is automatically provided by passport-local-mongoose */
/* This 'verifyFunc()' is called with the username and password that passport will extract from our incoming request */

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/* To support sessions in passport */

/* Creates the signed JSON web token */
exports.getToken = function(user) {
    return jwt.sign(user,config.secretKey, {expiresIn: 3600} );
};
/* jwt.sign() takes 'payload, 'secret' and additional options as parameters */

/* Setting up JSON WebToken based strategy for passport authentication */
var opts = {}; /* Strategy Options */
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); /* This option specifies how to extract JSON Webtoken from the incoming request message */
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("JWT Payload: ", jwt_payload);
        
        User.findOne({_id: jwt_payload._id}, (err, user)=>{
            if(err){
                return done(err, false);
            }
            else if(user){
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
/* Second parameter in JwtStrategy() is verifyFunc(); 'done' is passport callback func which takes 3 parameters - 'error', 'user?' and 'info?' */

/* To verify an incoming user */
exports.verifyUser = passport.authenticate('jwt', {session: false} );
/* Anytime we want to user's authenticity, we can call this 'verifyUser()' */

exports.verifyAdmin = (req, res, next)=>{
    console.log("\n\n", req.user);
    if(req.user.admin === true){
        console.log("\n\nHi Admin!");
        next();
    }
    else {
        console.log("\n\nYou ain't an Admin!");
        err = new Error('You are not authorized to perform this operation, buddy!');
        err.status = 403;
        return next(err);
    }
}