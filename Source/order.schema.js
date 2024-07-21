const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model('orders', orderSchema);
