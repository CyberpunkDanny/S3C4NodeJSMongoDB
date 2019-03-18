const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    }) /* Preflight Request */
    .get(cors.cors, (req, res, next) => {
        Dishes.find(req.query) /* To pass query parameters. E.g: ?featured=true */
            .populate('comments.author')
            .then((dishes)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(dishes);
            })
            .catch((err)=>{
                next(err);
            }) /* If an error is returned, it'll be passed on to the overall error handler of the application */
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Dishes.create(req.body)
            .then((dish)=>{
                console.log("Dish Created ", dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(dish);
            })
            .catch((err)=>{
                next(err);
            });
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /dishes');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Dishes.remove({})
            .then((response)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(response);    
            })
            .catch((err)=>{
                next(err);
            });
    })

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    }) /* Preflight Request */
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(dish);
            })
            .catch((err)=>{
                next(err);
            });        
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('POST operation not supported on /dishes/'+req.params.dishId);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Dishes.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, {
                new: true
            })
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(dish);
            })
            .catch((err)=>{
                next(err);
            });
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((response)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(response);
            })
            .catch((err)=>{
                next(err);
            });
    });

module.exports = dishRouter;