const MongoClient = require('mongodb').MongoClient;
/* MongoClient enables us to connect to Mongo Server*/

const assert = require('assert');
/* 'assert' module enables us to use the assert to check for True or False values within our app */

/* Starting up connection to server */

const url = "mongodb://localhost:27017/";
/* url is where mongodb server can be accessed */

const dbname = 'conFusion';

MongoClient.connect(url, (err, client)=>{
    
    assert.equal(err, null); 
    /* assert checks if err is null */
    
    console.log("Connected correctly to the server\n");
    
    const db = client.db(dbname);
    /* To connect to the database */
    
    const collection =  db.collection('dishes');
    collection.insertOne({"name": "Utthappizza", "description":"Test"}, (err, result)=>{
        assert.equal(err, null);
    
        console.log("After Insert:\n");
        console.log(result.ops);
        /* "result.ops" property tells how many operations are carried out successfully */
    
        collection.find({}).toArray((err, docs)=>{
            assert.equal(err, null);
            
            console.log("Found:\n");
            console.log(docs);
            
            db.dropCollection('dishes', (err, result)=>{
                assert.equal(err, null);
                
                client.close();
            });
        });
        /* find({}) means empty i.e., it returns all the docs */
    });
    /* insertOne() takes 'JSON document' & a 'callback' function as parameters */
    
});
/* connect() takes 'url' and 'callback' function as two parameters */