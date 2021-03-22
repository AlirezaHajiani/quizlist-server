const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const WeeklyBestSchema = new Schema({
  scores: [{type: String}],
  Created_date: {
      type: Date,
      default: Date.now
    },
});

module.exports = mongoose.model('WeeklyBest', WeeklyBestSchema);
