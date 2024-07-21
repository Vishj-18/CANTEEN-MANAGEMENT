const { default: mongoose } = require("mongoose");
const orderSchema = require("../schema/order.schema");
const itemSchema = require("../schema/item.schema");

const createOrUpdateCart = async (req, res) => {
    // get user id and item id from body
    let { userId, itemId, quantity } = req.body;

    // check if all required fields are present
    if (!userId || !itemId)
        return res.status(400).json({ message: "All required fields" });
    if (typeof quantity !== "number" || quantity < 0)
        return res.status(400).json({ message: "Quantity must be a number" });

    // convert user id and item id to ObjectId
    userId =
        typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
    itemId =
        typeof itemId === "string" ? new mongoose.Types.ObjectId(itemId) : itemId;

    // check if cart already exists
    const cartPresent = await orderSchema.findOne({ userId, itemId, paid: false }).lean();

    // check if quantity is greater than product quantity
    const item = await itemSchema.findOne({ _id: itemId }).lean();
    if (quantity > item.quantity)
        return res
            .status(400)
            .json({
                message: `Only ${item.quantity} ${item.unit} ${item.name} available`,
            });

    if (quantity === 0 && cartPresent) {
        // delete cart
        const deletedCart = await orderSchema.findOneAndDelete({
            _id: cartPresent._id,
        });
        return res.json({ cart: deletedCart });
    } else if (cartPresent) {
        // update cart
        const updatedCart = await orderSchema.findOneAndUpdate(
            { _id: cartPresent._id },
            { quantity },
            { new: true }
        );
        return res.json({ cart: updatedCart });
    } else {
        // create new cart
        const newCart = await orderSchema.create({ userId, itemId, quantity });
        return res.json({ cart: newCart });
    }
};

const getCartItems = async (req, res) => {
    const cartItems = await orderSchema
        .find({ userId: req.user._id, paid: false })
        .populate("itemId")
        .lean();
    return res.send({ cartItems });
};

module.exports = {
    createOrUpdateCart,
    getCartItems,
};
