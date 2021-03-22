const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const SuggestionSchema = new Schema({
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
  question : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      },
  match : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
      },
  answer: String,
  Created_date: {
      type: Date,
      default: Date.now
    },
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
