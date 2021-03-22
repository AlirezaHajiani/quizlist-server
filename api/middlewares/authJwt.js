const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const {SECRET} = require('../config/authConfig');
const jwt = require('jwt-simple');
const db = require("../models");
const Users = db.user;

// passport.use(new BearerStrategy((token, done) => {
//   // console.log("Bearer");
//   try {
//     const { id, auth } = jwt.decode(token, SECRET);
//     return Users.findById(id)
//     .then((user) => {
//      if(!user) {
//        done(null, false);
//      }
//       if(user.auth==auth){
//         done(null, user);
//       }
//       else {
//         done(null, false);
//       }
//     });
//   } catch (error) {
//     done(null, false);
//   }
// }));

passport.use(new BearerStrategy((token, done) => {
  // console.log("Bearer");
    const { id, auth } = jwt.decode(token, SECRET);
    Users.findById(id)
    .then((user) => {
                     if(!user) {
                       return done(null, false);
                     }
                      if(user.auth==auth){
                        return done(null, user);
                      }
                      return done(null, false);
    })
    .catch((e)=>{
        return done(e);
    })

}));

verifyToken = passport.authenticate('bearer', { session: false });
verifyQToken =  (req,res,next)=>{
  if(!req.headers.authorization)
  {
    res.sendStatus(500);
    return;
  }
  else {
    if(req.headers.authorization.toString()==='H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x!A%D*G-KaPdSgUkXp2s5v8y/B?E(H+MbQeThWmYq3t6w9z$C&F)J@NcRfUjXn2r4u7x!A%D*G-KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A?D*G-KaPdSgVkYp3s6v9y$B&E)H+MbQeThWmZ')
    {
      next();
    }
    else {
        res.sendStatus(500);
        return;
    }
  }
};

const authJwt = {
  verifyToken,
  verifyQToken,
};

module.exports = authJwt;
