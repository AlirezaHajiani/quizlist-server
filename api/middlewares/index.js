const authJwt = require("./authJwt");
const match=require('./match');
const push=require('./pushService');
//const verifySignUp = require("./verifySignUp");
//authJwt = (req, res) => {
//  res.status(200).send(req.user);
//};

module.exports = {
  authJwt,
  match,
  push,
};
