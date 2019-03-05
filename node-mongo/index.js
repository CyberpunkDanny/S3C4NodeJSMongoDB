const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = "mongodb://localhost:27017/";
const dbname = 'conFusion';

MongoClient.connect(url, (err, client)=>{
    
    assert.equal(err, null); 
    /* assert checks if err is null */
    
    console.log("Connected correctly to the server\n");
    
    const db = client.db(dbname);
    
    dboper.insertDocument(db, {name: "Vadonut", description: "Test"}, 'dishes', (result)=>{
        console.log("Insert Document: \n", result.ops);
        
        dboper.findDocuments(db, 'dishes', (docs)=>{
            console.log("Found Documents:\n", docs);
            
            dboper.updateDocument(db, {name: 'Vadonut'}, {description: "Updated test"}, 'dishes', (result)=>{
                console.log("Updated Docment: \n", result.result);
                
                dboper.findDocuments(db, 'dishes', (docs)=>{
                    console.log("Found Documents:\n"+ docs);
                    
                    db.dropCollection('dishes', (result)=>{
                        console.log("Dropped Collection: ", result);
                        
                        client.close();
                    });
                });
            });
        });
    });
    
});
