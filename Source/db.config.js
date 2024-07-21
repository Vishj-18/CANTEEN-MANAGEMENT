const mongo = require("mongoose");

module.exports = async () => mongo.connect("mongodb+srv://jainaman2302:LiNJ15aZe6Wpxjpl@naman-cluster.myxhpr2.mongodb.net/canteen?retryWrites=true&w=majority");