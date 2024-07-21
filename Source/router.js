const { createItems, getItems } = require("../controller/items.ctrl");
const { createOrUpdateCart, getCartItems } = require("../controller/order.ctrl");
const { payment, transactions } = require("../controller/payment.ctrl");
const { createUser, login } = require("../controller/user.ctrl");
const { authMiddleware } = require("../controller/utils.ctrl");

const router = require("express").Router();

// base route
router.get("/", (req, res) => {
    res.send("Hello World");
});

// user route
router.post("/create-user", createUser);
router.post("/login", login);

// items route
router.post("/create-items", authMiddleware, createItems);
router.post("/get-items", authMiddleware, getItems);

// cart route
router.post("/update-order", authMiddleware, createOrUpdateCart);
router.get("/cart", authMiddleware, getCartItems);

// payment 
router.post("/payment", authMiddleware, payment)
router.get("/transactions", authMiddleware, transactions)


module.exports = router
