const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next)=>{
        Promotions.find({})
            .then((promos)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            })
            .catch((err)=>next(err));
    })

    .post((req, res, next)=>{
        Promotions.create(req.body)
            .then((promo)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            })
            .catch((err)=>next(err));
    })

    .put((req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /promos');
    })

    .delete((req, res, next)=>{
        Promotions.remove({})
            .then((response)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);                
            })
            .catch((err)=>next(err));
    })

promoRouter.route('/:promoId')

    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promo)=>{
                if(promo != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');        
                    res.json(promo);
                }
                else {
                    err = new Error('Promotion '+ req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);   
                }
            })
            .catch((err)=>next(err));
    })

    .post((req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('POST operation not supported on /promotions/'+req.params.promoId);
    })

    .put((req, res, next)=>{
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
            },{
                new: true
            })
            .then((promo)=>{
                if(promo != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(promo);
                }
                else {
                    err = new Error('Promotion '+ req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err)=>next(err));
    })

    .delete((req, res, next)=>{
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((response)=>{
                if(response != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                }
                else {
                    err = new Error('Promotion '+ req.params.promoId + ' not found');
                    err.status = 404;
                    return next(err);    
                }
            })
            .catch((err)=>next(err));
    })

module.exports = promoRouter;