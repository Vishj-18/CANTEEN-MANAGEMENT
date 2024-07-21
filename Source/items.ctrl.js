const { default: mongoose } = require("mongoose");
const itemSchema = require("../schema/item.schema");

const createItems = async (req, res) => {
    // get data from body
    const { name, price, description, image, type, unit, quantity } = req.body;

    // check if all fields are filled
    if (!name || !description || !image || !type || !unit)
        return res.status(400).json({ message: "All fields are required" });

    // check if quantity is greater than 0
    if (typeof quantity !== "number" || quantity <= 0)
        return res.status(400).json({ message: "Quantity must be greater than 0" });

    // check if price is greater than 0
    if (typeof price !== "number" && price <= 0)
        return res.status(400).json({ message: "Price must be greater than 0" });

    // check if user is admin
    if (req.user.type !== "admin")
        return res
            .status(401)
            .json({ message: "Unauthorized - only admin can create items!" });

    // create item
    try {
        const item = await itemSchema.create({
            name,
            price,
            description,
            image,
            type,
            unit,
            quantity,
        });

        // return created item
        return res.status(201).json(item);
    } catch (err) {
        // return error
        return res.status(500).json({ message: err.message });
    }
};

const getItems = async (req, res) => {
    // get data from body
    let { sort, type, query, price } = req.body;

    // check if sort query is valid
    if (!sort) return res.status(400).json({ message: "Invalid sort query" });

    let match = { quantity: { $gt: 0 } };

    // check if query is valid and add it to match
    if (query && query.length > 0)
        match["name"] = { $regex: query, $options: "i" };

    // check if price is valid and add it to match
    if (price?.min && price?.max)
        match["price"] = { $gte: price.min, $lte: price.max };
    else if (price?.min) match["price"] = { $gte: price.min };
    else if (price?.max) match["price"] = { $lte: price.max };

    // check if type is valid and add it to match
    if (type && type.length > 0) match["type"] = type;

    // get all items that match the query from database
    const allItems = await itemSchema.aggregate([
        ...(Object.values(match).length > 0 ? [{ $match: match }] : []),
        {
            $sort: sort,
        },
        {
            $lookup: {
                from: "orders",
                let: { itemId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            userId: req.user._id,
                            paid: false,
                            $expr: {
                                $eq: ["$itemId", "$$itemId"],
                            }
                        },
                    },
                    {
                        $project: {
                            quantity: 1
                        }
                    },
                    {
                        $unwind: {
                            path: "$orders",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ],
                as: "orders",
            },
        },
    ]);

    // return all items
    return res.status(200).json(allItems);
};

module.exports = {
    createItems,
    getItems,
};
