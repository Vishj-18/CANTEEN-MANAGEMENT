const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    orderId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "orders",
        required: true
    },
    mop: {
        type: String,
        required: true,
        enum: ["cash", "upi"]
    }
}, {
    timestamps: true,
    versionKey: false
})


module.exports = mongoose.model('payments', paymentSchema);
