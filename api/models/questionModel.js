const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: String,
  answer1: [{type: String}],
  answer2: [{type: String}],
  answer3: [{type: String}],
  good: { type: Number, default: 0 },
  bad: { type: Number, default: 0 },
  active: { type: Boolean, default: true},
  Created_date: {
      type: Date,
      default: Date.now
    },
});

module.exports = mongoose.model('Question', QuestionSchema);
