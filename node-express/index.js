const express = require('express');
const http = require('http');

const hostname = 'localhost';
const port = 3000;

/* This way we are saying that our app is gonna use Express */
const app = express();

/* Constructing Web Server */
app.use((req, res, next) => {
    console.log(req.headers);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>Express Server</h1></body></html>');
});
/* 'next' is an additional middleware(optional) */

const server = http.createServer(app);

server.listen(port, hostname, ()=>{
    console.log(`Server is running at http://${hostname}:${port}`);
})