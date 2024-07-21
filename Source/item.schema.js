const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['veg', 'non-veg', 'egg', "beverage"]
    },
    unit: {
        type: String,
        required: true,
        enum: ['gm', 'ltr', 'pcs']
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('items', itemSchema)
