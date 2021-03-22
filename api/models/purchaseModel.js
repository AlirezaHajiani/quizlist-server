const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
  purchase : {type: String},
  verify: { type: Number, default: 0 },
  Created_date: {
      type: Date,
      default: Date.now
    },
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
