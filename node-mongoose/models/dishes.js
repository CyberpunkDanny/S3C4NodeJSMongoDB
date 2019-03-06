const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema =  new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5, 
        required: true
    },
    comment:{
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String, 
        required: true
    },
    comments: [commentSchema]
}, {
    timestamps: true
});
/* comments is an array of type 'commentSchema' i.e., every dish document can have multiple comments stored inside it as an array (sub-documents) */

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;