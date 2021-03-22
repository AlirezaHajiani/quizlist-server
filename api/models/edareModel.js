const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const EdareSchema = new Schema({
  name : {type: String},
  verify: { type: Number, default: 0 },
  Created_date: {
      type: Date,
      default: Date.now
    },
});

module.exports = mongoose.model('EdareModel', EdareSchema);
