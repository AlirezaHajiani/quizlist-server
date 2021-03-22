const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const MatchSchema = new Schema({
  user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
  user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
  questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }],
  answer1: [[]],
  answer2: [[]],
  score1:  [{ type: Number}],
  score2:  [{ type: Number}],
  score1total: { type: Number, default: 0 },
  score2total: { type: Number, default: 0 },
  relevation1:  [{ type: Boolean}],
  relevation2:  [{ type: Boolean}],
  round:  { type: Number, default: 0 },
  finished: { type: Boolean, default: false},
  flag: { type: Boolean, default: false},
  timeUp: { type: Boolean, default: false},
  winner: { type: Number, default: 0 },
  turn: { type: Number, default: 0 },
  Created_date: {
      type: Date,
      default: Date.now
    },
  Updated_date: {
      type: Date,
      default: Date.now
    },
});

MatchSchema.pre('save', function(next) {
  // do stuff
  this.Updated_date=Date.now();
  next();
});

module.exports = mongoose.model('Match', MatchSchema);
