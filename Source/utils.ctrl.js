const jwt = require("jsonwebtoken");
const userSchema = require("../schema/user.schema");

const getJWTToken = (user) => jwt.sign(
    {
        _id: user._id,
        email: user.email,
        type: user.role,
        userName: user.userName
    },
    "canteen-management-system"
);

const authMiddleware = (req, res, next) => {
    // Check if authorization header is present
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Get token from header
    const token = req.headers.authorization.split(" ")[1];

    // Check if token is present
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify token
    jwt.verify(token, "canteen-management-system", async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        const user = await userSchema.findOne({ email: decoded.email });
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
    })
}

module.exports = {
    getJWTToken,
    authMiddleware
}