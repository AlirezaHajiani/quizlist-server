const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./userModel");
db.question = require("./questionModel");
db.match = require("./matchModel");
db.purchase = require("./purchaseModel");
db.suggestion = require("./suggestionModel");
db.weeklybest = require("./weeklyBestModel");

db.edareModel = require("./edareModel");

module.exports = db;
