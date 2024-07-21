const { default: mongoose } = require("mongoose");
const itemSchema = require("../schema/item.schema");
const orderSchema = require("../schema/order.schema");
const paymentSchema = require("../schema/payment.schema");

const payment = async (req, res) => {
    const { mop } = req.body;

    if (!mop || !["cash", "upi"].includes(mop))
        return res
            .status(400)
            .json({ success: false, message: "Missing or Invalid mop" });

    const userId =
        typeof req.user._id === "string"
            ? new mongoose.Types.ObjectId(req.user._id)
            : req.user._id;
    const orderInUserCart = await orderSchema
        .find({ userId: userId, paid: false })
        .lean();
    if (orderInUserCart.length == 0)
        return res.status(400).json({ success: false, message: "Cart is empty" });
    await orderSchema
        .updateMany({ userId: userId, paid: false }, { $set: { paid: true } })
        .lean();

    // decrease item quantity
    for (let i = 0; i < orderInUserCart.length; i++) {
        await itemSchema.findOneAndUpdate(
            { _id: orderInUserCart[i].itemId },
            { $inc: { quantity: -orderInUserCart[i].quantity } }
        );
    }

    const payment = await paymentSchema.create({
        userId: userId,
        orderId: orderInUserCart.map((item) => item._id),
        mop,
    });

    return res.status(200).json({ success: true, payment });
};

const transactions = async (req, res) => {
    const userId =
        typeof req.user._id === "string"
            ? new mongoose.Types.ObjectId(req.user._id)
            : req.user._id;
    const transactions = await paymentSchema
        .find({ userId: userId })
        .populate({ path: "orderId", populate: { path: "itemId" } })
        .sort({ createdAt: -1 })
        .lean();
    return res.status(200).json({ success: true, transactions });
};

module.exports = { payment, transactions };
