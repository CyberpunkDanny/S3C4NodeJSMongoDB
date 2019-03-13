/* Supports uploading of files */
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const multer = require('multer');

/* 'multer' provides diskStorage() which enables us to define storage engine */
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, 'public/images');
    },
    
    filename: (req, file, callback)=>{
        callback(null, file.originalname)
    }
});

/* FileFilter enables us to specify which kind of files we are willing to accept for upload */
const imageFileFilter = (req, file, callback)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return callback(new Error('You can upload only image files!'), false);
    }
    callback(null, true);
};

/* Configuring multer module */
const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    }) /* Preflight Request */
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /imageUpload');
    })
    
    /* upload.single() takes as parameter the name of the form field which specifies that file */
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file); /* req.file object contains the path to the file which can be used by client */
    })
    /* upload() will handle errors itself */
    
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /imageUpload');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /imageUpload');
    })


module.exports = uploadRouter;