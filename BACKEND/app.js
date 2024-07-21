const express = require("express");
const cors = require("cors");
const app = express();
const Connect = require("./src/config/db.config");
const router = require("./src/router/router");

app.use(cors());
app.use(express.json());

app.use("/", router)

app.listen(3000, async () => {
    try {
        await Connect()
        console.log("Server started on port 3000")
    } catch (e) {
        console.log(e)
    }
});