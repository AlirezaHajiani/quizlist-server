const db = require("../models");
const User = db.user;
const Purchase = db.purchase;

const {COINS} = require('../config/IAPconfig.js');

exports.coins = (req, res) => {
  res.json(COINS);
}

exports.purchase= (req, res) => {
  // res.json(req.body.mSku);
  var coin=COINS.find(o => o.sku === req.body.mSku);
  const newPurchase = new Purchase({user: req.user._id,
                                    purchase: JSON.stringify(req.body)});
  newPurchase.save()
  // res.json(coin);
  if(coin)
  {
    req.user.coins += coin.coin;
    req.user.markModified('coins');
    req.user.relevation+=coin.relev;
    req.user.markModified('relevation');
    req.user.save()
    .catch(err => console.log(err));
    res.json(req.user);
  }
  else {
    res.sendStatus(500);
  }
  // res.json(COINS);
}

exports.adcoin= (req, res) => {
  if((req.user.advertise-Date.now())<0)
  {
    req.user.coins += 45;
    req.user.markModified('coins');
    req.user.advertise=Date.now()+55*60*1000;
    req.user.markModified('advertise');
    req.user.save()
    .catch(err => console.log(err));
  }
  res.json(req.user);
  // res.json(COINS);
}
