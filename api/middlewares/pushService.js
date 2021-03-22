const db = require("../models");

checkPushId =(req, res, next) => {
  // console.log(req.body.pushId);
  if(req.body.pushId)
   if(req.user.pushid!=req.body.pushId)
   {
     if(req.body.pushId!='')
     {
       req.user.pushid=req.body.pushId;
       req.user.markModified('pushid');
       req.user.save()
       .then(()=>next())
       .catch(err => {
           res.sendStatus(500);
       })
       // console.log("Not Equal");
     }
   }
   next();
};

const push = {
  checkPushId,
};

module.exports = push;
