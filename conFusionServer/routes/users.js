var express = require('express');
const bodyParser = require('body-parser');

var User = require('../models/user');

var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

const cors = require('./cors');

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
        .then((users)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/JSON');
            res.json(users);
        })
        .catch((err)=>{
            next(err);
        })
});

router.post('/signup', cors.corsWithOptions, function(req, res, next){
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        else {
            if(req.body.firstname)
                user.firstname = req.body.firstname;
            if(req.body.lastname)
                user.lastname = req.body.lastname;
            user.save()
                .then((user)=>{
                    passport.authenticate('local')(req, res, ()=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful'});
                        });
                })
                .catch((err)=>{
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                })
        }
    });
});

/* To Login the user */
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), function(req, res){
    var token = authenticate.getToken({_id: req.user._id});
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You\'re successfulyy logged in!'});    
});

/* To Logout the user */
router.get('/logout', function(req, res, next){
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        return next(err);
    }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res)=>{
    if(req.user){
        var token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You\'re successfully logged in!'});
    }
});

module.exports = router;
