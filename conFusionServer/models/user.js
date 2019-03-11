var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    }
});

/* 'username' & 'password' will automatically be added by passport-local-mongoose */

User.plugin(passportLocalMongoose);
/* This will automatically support for username and hased storage of password using saltn hash */
module.exports = mongoose.model('User', User);