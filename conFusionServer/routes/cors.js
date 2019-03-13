/* To configure cors module */

const express = require('express');
const cors = require('cors');
const app = express();

/* whiteList contains all the origins that the server is willing to accept */
const whiteList = [
    'http://localhost:3000',
    'https://localhost:3443'
];

/* To see if incoming requests belong to whitelisted origins */
var corsOptionsDelegate = (req, callback)=> {
    var corsOptions;
    
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors(); /* cors() with no parameters reply back with Access-Control-Allow-Origin with '*'. Acceptable on GET operations */
exports.corsWithOptions = cors(corsOptionsDelegate);