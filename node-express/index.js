const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();

/* Constructing Web Server */

/* Whenever we need to use a middleware, we say app.use() */
app.use(morgan('dev'));
app.use(bodyParser.json());


/* In React Course, we used JSON server which provided us 'dishes' for us. Now, this is a real server constructed using Express which receives & processes incoming req and generates appropriate response */
app.all('/dishes', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});
/* next() continues to look for addnl. specifications down below that matches the above END POINT. It passes the modified 'req' & 'res' as parameters to next specification */

app.get('/dishes', (req, res, next) => {
    res.end('Will send all the dishes to you!');
});

app.post('/dishes', (req, res, next)=>{
    res.end('Will add the dish: ' + req.body.name + ' with details: '+ req.body.description);
});

app.put('/dishes', (req, res, next)=>{
    res.statusCode = 403; //Forbidden
    res.end('PUT operation not supported on /dishes');
});

app.delete('/dishes', (req, res, next)=>{
    res.end('Deleteing All Dishes');
});


app.get('/dishes/:dishId', (req, res, next) => {
    res.end('Will send details of the dish: '+ req.params.dishId);
});

app.post('/dishes/:dishId', (req, res, next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
});

app.put('/dishes/:dishId', (req, res, next)=>{
    res.write('Updating the dish: '+ req.params.dishId)
    res.end('\nWill update the dish '+ req.body.name + ' with details: '+ req.body.description);
});

app.delete('/dishes/:dishId', (req, res, next)=>{
    res.end('Deleteing the dish: '+ req.params.dishId);
});

app.use(express.static(__dirname+'/public'));

app.use((req, res, next) => {    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>Express Server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port, hostname, ()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
})