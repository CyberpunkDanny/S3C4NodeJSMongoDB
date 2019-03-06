const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log("Connected currenlty to the server");
    
    /* create() method takes a new document that is to be stored */
    Dishes.create({
        name: 'UthappizzaTest',
        description: 'test'
    })
    .then((dish)=>{
            console.log(dish);
            
            return Dishes.findByIdAndUpdate(dish._id, {
                $set: { description: 'Updated test'}
            },{
                new: true    
            })
            /* 'new' means that once update is done, this will return updated dish back to us */
    })
    .then((dish)=>{
            console.log(dish);
            
            dish.comments.push({
                rating: 5,
                comment: 'I\'m getting a sinking feeling!',
                author: 'Leonardo Di Carpaccio'
            });
        
            return dish.save();
    })
    .then((dish)=>{
        console.log(dish);
        
        return Dishes.remove({});
    })
    .then(()=>{
            return mongoose.connection.close();
    })
    .catch((err)=>console.log(err));
})
.catch((err)=>console.log("\n\nError Connecting to Mongo Database \n\n ", err));
