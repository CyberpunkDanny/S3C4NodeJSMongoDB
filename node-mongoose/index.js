const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected currenlty to the server");
    
    /* create() method takes a new document that is to be stored */
    Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    })
    .then((dish)=>{
            console.log(dish);
            return Dishes.find({});
    })
    .then((dishes)=>{
            console.log(dishes);
            return Dishes.remove({});
    })
    .then(()=>{
            return mongoose.connection.close();
    })
    .catch((err)=>console.log(err));
})
.catch((err)=>console.log("\n\nError Connecting to Mongo Database \n\n ", err));
