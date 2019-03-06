const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
});
/* Mongoose automatically inserts timestamps into out model. createdAt & updatedAt are added*/

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;