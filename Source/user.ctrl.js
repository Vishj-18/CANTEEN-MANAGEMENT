const userSchema = require("../schema/user.schema");
const { getJWTToken } = require("./utils.ctrl");

const createUser = async (req, res) => {
    // get all the data from the body
    const { email, password, role, userName } = req.body;

    // check if all the fields are required
    if (!email || !password || !role || !userName)
        return res.status(400).json({ error: "All fields are required" });

    // check if user already exist
    const isUserExist = await userSchema.findOne({ $or: [{ email }, { userName }] }).lean();

    // if user already exist return error
    if (isUserExist) return res.status(409).json({ error: "Email or Username already exist!" });

    // create user
    const user = await userSchema.create({ email, password, role, userName });

    // if user not created return error
    if (!user) return res.status(500).json({ error: "Failed to create user" });

    // return success
    return res.status(201).json({ message: "User created successfully", user });
};

const login = async (req, res) => {
    // get all the data from the body
    const { email, password } = req.body;

    // check if all the fields are required
    if (!email || !password)
        return res.status(400).json({ error: "All fields are required" });

    // check if user already exist
    const isUserExist = await userSchema.findOne({ email });

    // if user not exist return error
    if (!isUserExist) return res.status(409).json({ error: "Invalid email id!" });

    // check if password is correct
    if (!isUserExist.authenticate(password))
        return res.status(401).json({ error: "Invalid credentials" });

    // create token
    const token = getJWTToken(isUserExist);

    // return success
    return res.status(200).json({ message: "Login successfully", token, user: isUserExist });
};

module.exports = {
    createUser,
    login,
};
