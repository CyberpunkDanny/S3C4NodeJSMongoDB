const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .all((req, res, next)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next)=>{
        res.end("Will send all promotion details!");
    })
    .post((req, res, next)=>{
        res.end('Will add the promotion: ' + req.body.name + ' with details: '+ req.body.description);
    })
    .put((req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('PUT operation not supported on /promos');
    })
    .delete((req, res, next)=>{
        res.end('Deleteing All Promotions');
    });

promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send details of the promotion: '+ req.params.promoId+ ' to you!');
    })
    .post((req, res, next)=>{
        res.statusCode = 403; //Forbidden
        res.end('POST operation not supported on /promotions/'+req.params.promoId);
    })
    .put((req, res, next)=>{
        res.write('Updating the promotion: '+ req.params.promoId);
        res.end('Will update the promotion: ' + req.body.name + ' with details: '+ req.body.description);
    })
    .delete((req, res, next)=>{
        res.end('Deleteing the promotion: '+ req.params.promoId);
    });

module.exports = promoRouter;