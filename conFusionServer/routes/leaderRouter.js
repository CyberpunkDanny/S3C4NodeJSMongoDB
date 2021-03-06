const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    }) /* Preflight Request */
    .get(cors.cors, (req, res, next)=>{
        Leaders.find(req.query)
            .then((leaders)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            })
            .catch((err)=>next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Leaders.create(req.body)
            .then((leader)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            })
            .catch((err)=>next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /leaders');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Leaders.remove({})
            .then((response)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);                
            })
            .catch((err)=>next(err));
    })


leaderRouter.route('/:leaderId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    }) /* Preflight Request */
    .get(cors.cors, (req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then((leader)=>{
                if(leader != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');        
                    res.json(leader);
                }
                else {
                    err = new Error('Leader '+ req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);   
                }
            })
            .catch((err)=>next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('POST operation not supported on /leaders/'+req.params.leaderId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
            },{
                new: true
            })
            .then((leader)=>{
                if(leader != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(leader);
                }
                else {
                    err = new Error('Leader '+ req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err)=>next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Leaders.findByIdAndRemove(req.params.leaderId)
            .then((response)=>{
                if(response != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                }
                else {
                    err = new Error('Leader '+ req.params.leaderId + ' not found');
                    err.status = 404;
                    return next(err);    
                }
            })
            .catch((err)=>next(err));
    })




module.exports = leaderRouter;