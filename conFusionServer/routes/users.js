var express = require('express');
const bodyParser = require('body-parser');

var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next){
    User.findOne({username: req.body.username})
        .then((user)=>{
            if(user != null){
                var err = new Error('User '+ req.body.username+ ' already exists');
                err.status = 403;
                next(err);
            }
            else {
                return User.create({
                    username: req.body.username,
                    password: req.body.password
                });
            }
        })
        .then((user)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: 'Registration Successful', user: user});
        })
        .catch((err)=>next(err));
});

/* To Login the user */
router.post('/login', function(req, res, next){
    if(!req.session.user){
        var authHeader = req.headers.authorization;
    
        if(!authHeader){
            var err = new Error("You are not authenticated!");
            err.status = 401;
            res.setHeader('WWW-Authenticate', 'Basic');
            return next(err);
        }

        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        /* split() splits the string into elements whenever 'space' is encountered */

        var username = auth[0];
        var password = auth[1];
        
        User.findOne({username: username})
            .then((user)=>{
                if(user == null){
                    var err = new Error("User"+ username+ "doesn't exist");
                    err.status = 403;
                    return next(err);
                }
                else if(user.password != password){
                    var err = new Error("Your password is incorrect");
                    err.status = 403;
                    return next(err);
                }
                else {
                    req.session.user = 'authenticated';
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.json('You are authenticated!');
                }
            })
            .catch((err)=>next(err));
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json('You are already logged in!');
    }
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

module.exports = router;
