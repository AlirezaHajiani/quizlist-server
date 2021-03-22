const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require('jwt-simple');
const {SECRET} = require('../config/authConfig');

var Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: String,
  name: String,
  mobile: String,
  hash: String,
  salt: String,
  auth: String,
  pushid: String,
  firstTime: { type: Boolean, default: true},
  matches: { type: Number, default: 0 },
  wons: { type: Number, default: 0 },
  meancorrect: { type: Number, default: 0 },
  meantwo: { type: Number, default: 0 },
  meanthree: { type: Number, default: 0 },
  score: { type: Number, default: 1500 },
  weekscore: { type: Number, default: 1500 },
  image: { type: Boolean, default: false},
  avatar: { type: String, default: ''},
  gift: { type: String, default: ''},
  giftCount: { type: Number, default: 0},
  coins: { type: Number, default: 200 },
  coinsAdd: { type: Number, default: 0 },
  relevation: { type: Number, default: 3 },
  status: { type: Number, default: 0 },
  advertise: { type: Number, default: 0 },
  online: { type: Boolean, default: false},
  Created_date: {
      type: Date,
      default: Date.now
    },
  Updated_date: {
      type: Date,
      default: Date.now
    },

});

UsersSchema.pre('save', function(next) {
  // do stuff
  if(!this.auth)
    this.generateAuth();
  next();
});

// UsersSchema.pre('save', function(next) {
//   // do stuff
//   this.Updated_date=Date.now();
//   next();
// });


UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  // this.salt = crypto.randomBytes(16).toString('hex');
  if(this.salt)
  {
    const hash = crypto.pbkdf2Sync(password, this.salt , 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  }
  else {
    return false;
  }
  // return password;
};

UsersSchema.methods.generateAuth= function(){
  this.auth = crypto.randomBytes(8).toString('hex');
}

UsersSchema.methods.generateJWT = function() {
  return jwt.encode({ id: this._id, auth: this.auth}, SECRET)
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    //_id: this._id,
    // email: this.mobile,
    user:  this.name,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', UsersSchema);
