const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        console.log("\nUser ID: ", req.user._id);
        Favorites.findOne({user: req.user._id})
            .populate('user')
            .populate('dishes')
            .then((dishes)=>{
                console.log('\nDISHES: ', dishes);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.json(dishes);
            })
            .catch((err)=>next(err));
        })

    .post(authenticate.verifyUser, (req, res, next)=>{
        console.log("\nFav ID: ", req.body);
        Favorites.findOne({user: req.user._id}, (err, response)=>{
            if(err)
                next(err);
            if(!err && !response){
                Favorites.create({user: req.user._id, dishes: req.body})
                    .then((dishes)=>{
                        console.log("Favorite Dishes added");
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dishes);
                    })
                    .catch((err)=>{
                        next(err);
                    })                
            }
            if(response){
                console.log("RESPONSE: ", response);
                console.log("REQUEST BODY: ", req.body);
                for(var i=0; i<req.body.length; i++){
                    console.log("\nINDEXOF: ", response.dishes.indexOf(req.body[i]._id));
                    if(response.dishes.indexOf(req.body[i]._id) === -1){
                        console.log("\nREQ BODY ID: ", req.body[i]._id);
                        response.dishes.push(req.body[i]._id);
                    }
                }
                response.save()
                    .then((dishes)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dishes);    
                    })
                    .catch((err)=>next(err));
                
            }
        })    

    })

    .delete(authenticate.verifyUser, (req, res, next)=>{
        Favorites.findOne({user: req.user._id}, (err, response)=>{
            if(err)
                next(err);
            if(!err && !response){
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json("No Favorites Added");
            }
            if(response){
                console.log("\nRESPONSE inside DELETE: ", response);
                response.remove()
                    .then((resp)=>{
                        console.log("Favorite Dishes Deleted");
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);   
                    })
            }
        })
    })


favoriteRouter.route('/:dishId')
    .post(authenticate.verifyUser, (req, res, next)=>{
        Favorites.findOne({user: req.user._id}, (err, response)=>{

            console.log("\nPARAMS DISH ID: ", req.params.dishId);
            console.log("\nUSER ID: ", req.user._id);

            if(err)
                next(err);
            if(!err && !response){
                Favorites.create({user: req.user._id}, {dishes: []}, (err, resp)=>{
                    if(err)
                        next(err);
                    if(resp){
                        resp.dishes.push(req.params.dishId);
                        resp.save()
                            .then((favDish)=>{
                                console.log("Favorite Dish Added");
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favDish);   
                            })
                    }
                })
            }
            if(response){
                console.log("\nRESPONSE inside POST DISH ID: ", response);
                console.log("\nINDEX: ", response.dishes.indexOf(req.params.dishId));
                if(response.dishes.indexOf(req.params.dishId) === -1){
                    response.dishes.push(req.params.dishId);
                    response.save()
                        .then((dishes)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dishes);    
                        })
                        .catch((err)=>next(err));
                }
            }
        })
    })

    .delete(authenticate.verifyUser, (req, res, next)=>{
        Favorites.findOne({user: req.user._id}, (err, response)=>{
            console.log("\nPARAMS DISH ID: ", req.params.dishId);
            console.log("\nUSER ID: ", req.user._id);
            if(err)
                next(err);
            if(!err & !response){
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json('No Favorites Added');    
            }
            if(response){
                console.log("\nRESPONSE inside DELETE DISH ID: ", response);
                var indexToDel = response.dishes.indexOf(req.params.dishId);
                console.log("\nIndex to Delete: ", indexToDel);
                if(indexToDel > -1){
                    response.dishes.splice(indexToDel, 1);
                    response.save()
                        .then((dishes)=>{
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dishes);    
                        })                    
                }
                else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.json('Not a Favorite Dish to be deleted');    
                }
            }
        })
    })

module.exports = favoriteRouter;