const mongoose = require('mongoose');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    encry_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

userSchema.methods = {
    authenticate: function (plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword: function (plainpassword) {
        if (!plainpassword) return "";
        try {
            return crypto
                .createHmac("sha256", "canteen-management")
                .update(plainpassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
};

userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = "canteen-management";
        this.encry_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });



module.exports = mongoose.model('users', userSchema)
