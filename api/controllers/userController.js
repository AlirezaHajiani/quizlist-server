
const path = require('path');
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const {ADD_COIN_GIFT} = require('../config/gameConst.js');

const User = db.user;

exports.userData = (req, res) => {
  if(req.params.id)
  {
    User
        .findOne({_id: req.params.id},"-coins -relevation -status -Created_date -__v -hash -salt")
        .then(function (user) {
               res.send(user);
         })
         .catch(err => {
             res.sendStatus(500);
         });
  }
  else
  {
    let user=req.user.toObject();
    delete user.hash;
    delete user.salt;
    if(req.query.bundle && req.query.bundle<2)
    {
      user.message="ورژن جدید QuizList را لطفا دانلود نمایید";
    }
    else {
      user.message="";
    }
    res.json(user);
    req.user.online=true;
    req.user.Updated_date=Date.now();
    req.user.save()
    .catch(err => console.error(err));
  }

    //console.log("User Data");
};

exports.userProfile = (req, res) => {

  if(req.params.id)
  {
    User
        .findOne({_id: req.params.id},"-coins -relevation -status -pushid -auth -__v -hash -salt -firstTime -gift -giftCount")
        .lean()
        .then((user)=>{
            var date1 = new Date();
            var date2 = new Date(user.Updated_date);
            var diff = date1.getTime() - date2.getTime();

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff -=  days * (1000 * 60 * 60 * 24);

            var hours = Math.floor(diff / (1000 * 60 * 60));
            diff -= hours * (1000 * 60 * 60);

            var mins = Math.floor(diff / (1000 * 60));
            diff -= mins * (1000 * 60);

            if(days>0)
            {
              if(days<7)
                user.Updated_date=`${days} روز قبل`;
              else {
                user.Updated_date=`بیش از یک هفته`;
              }
            }
            else if(hours>0)
            {
              user.Updated_date=`${hours} ساعت قبل`;
            }
            else {
              user.Updated_date=`${mins} دقیقه قبل`;
            }

            var proms=[];
            proms.push(User.countDocuments({}).exec().catch(err => {res.sendStatus(500);return;}));
            // proms.push(User.find({
            //                       $or:[
            //                             {
            //                               score: {$gt:user.score}
            //                             },
            //                             {
            //                               score: {$eq:user.score}
            //                             }
            //                           ]
            //                       }).exec().catch(err => {res.sendStatus(500);return;}));

            proms.push(User
                           .aggregate(
                           [
                             {
                               $match:{
                                 $or:[
                                   {
                                     score:{ $gt: user.score}
                                   },
                                   {
                                     $and:[{score:{ $eq: user.score}},{Created_date: {$lt: user.Created_date}}]
                                   }
                                 ]

                               }
                             },
                             {
                               $count: "rank"
                             }
                           ]
                           ).catch(err => {res.send(500);return;}));

            // proms.push(User
            //                .aggregate(
            //                [
            //                  {
            //                    $match:{
            //                          Created_date:{$lt: user.Created_date}
            //                    }
            //                  },
            //                  {
            //                    $count: "rank"
            //                  }
            //                ]
            //                ).catch(err => {res.send(500);return;}));

            Promise.all(proms).then( ([total,rank])=>res.json({...user,total:total,rank:rank.length?rank[0].rank+1:1}));
        })
        .catch(err => {
                      res.sendStatus(500);
                      return;
        });

    // User
    //     .findOne({_id: req.params.id},"-coins -relevation -status -Created_date -Updated_date -pushid -__v")
    //     .lean()
    //     .then(function (user) {
    //
    //            user.test="111";
    //
    //            res.send(user);
    //      })
    //      .catch(err => {
    //          res.sendStatus(500);
    //      });
  }
  else
  {
    let user=req.user.toObject();
    delete user.hash;
    delete user.salt;
    res.json(user);
  }

 //console.log("User Profile");
};

exports.newUser = (req, res) => {
  // console.log( req.body.pushId);
  User
    .countDocuments({})
    .then(count => {
        let finalUser;
        //console.log("New USer");
        if(req.body.name!='')
            finalUser = new User({name: req.body.name ,pushid: req.body.pushId.toString()});
        else
            finalUser = new User({name: "Guest_"+(count+1),pushid: req.body.pushId.toString()});

        return finalUser.save()
        .then(()=> res.json(finalUser.toAuthJSON() ))
        .catch(err => {
            res.sendStatus(500);
        })
        //res.json({ message: count });
    })
    .catch(err => {
        res.sendStatus(500);
    })
};

exports.signin = (req, res) => {
  if(req.body)
  {
    // res.json(req.body.username);
    User.findOne({
      name: req.body.username
    })
    .exec()
    .then((user)=>{
      // res.json(req.body.password);
        if(user)
        {
          if(user.validatePassword(req.body.password))
          {
            user.generateAuth();
            user.save();
            res.json(user.toAuthJSON());
          }
          else
          {
            res.sendStatus(401);
          }
        }
        else
        {
          res.sendStatus(401);
        }
    })
    .catch(err => {
        res.json("Err"+err);
    });
  }
  else {
    res.sendStatus(500);
  }
}
exports.userUpdate = (req, res) => {
    if(req.body.coinsAdd<0)
    {
      req.user.coins+=req.body.coinsAdd;
      req.user.markModified('coins');
    }
    if(req.body.relevation<req.user.relevation)
    {
      req.user.relevation=req.body.relevation;
      req.user.markModified('relevation');
    }
    req.user.firstTime=req.body.firstTime;
    req.user.name=req.body.name;
    if(req.body.password)
    {
      req.user.setPassword(req.body.password);
    }
    req.user.save()
    .catch(err => console.error(err));
    let user=req.user.toObject();
    delete user.hash;
    delete user.salt;
    res.json(user);
    //console.log("User Update");
};

exports.userSearch = (req, res) => {

  if(req.params.name)
  {
    User
        .find({$or:[{name: { "$regex": req.params.name , "$options": "i" }},{username: { "$regex": req.params.name , "$options": "i" }}]},"-coins -relevation -status -Created_date -auth -pushid -__v -hash -salt -firstTime -gift -giftCount")
        .limit(100)
        .then(function (user) {
               res.send(user);
         })
         .catch(err => {
             res.sendStatus(500);
         });
  }
  else
  {
    let user=req.user.toObject();
    delete user.hash;
    delete user.salt;
    res.json(user);
  }
};

exports.userNameCheck = (req, res) => {

  if(req.params.name)
  {
    User
        .find({$or:[{name:  req.params.name  },{username: req.params.name }]},"-coins -relevation -status -Created_date -auth -pushid -__v -hash -salt -firstTime -gift -giftCount")
        .then(function (user) {
               res.send(user);
         })
         .catch(err => {
             res.sendStatus(500);
         });
  }
  else
    {
      let user=req.user.toObject();
      delete user.hash;
      delete user.salt;
      res.json(user);
    }
};

exports.userAvatar = (req, res) => {
  // let user=req.user.toObject();
  // delete user.hash;
  // delete user.salt;
  const imagePath = path.join(__dirname, '../../public/avatars/');

  var binaryData = new Buffer.from(req.body.image, 'base64').toString('binary');
  if(binaryData.length<102400)
  {
    // require("fs").writeFile(imagePath+req.user._id, binaryData, 'binary', function(err) {
      if(req.user.avatar && req.user.avatar.length>0)
      {
        require("fs").unlink(imagePath+req.user.avatar, function(err) {
        if(err && err.code == 'ENOENT') {
            // file doens't exist
            console.error("File doesn't exist, won't remove it.");
        } else if (err) {
            // other errors, e.g. maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            // console.info(`removed`);
        }
        });
      }
    let fileName=uuidv4();
    require("fs").writeFile(imagePath+fileName, binaryData, 'binary', function(err) {
      console.log(err);
    });
    req.user.image=true;
    req.user.avatar=fileName;
    req.user.save()
    .catch(err => console.log(err));
    res.sendStatus(200);
  }
  else {
    res.sendStatus(500);
  }

};

exports.userAvatarRM = (req, res) => {
    const imagePath = path.join(__dirname, '../../public/avatars/');
    if(req.user.avatar && req.user.avatar.length>0)
    {
      require("fs").unlink(imagePath+req.user.avatar, function(err) {
      if(err && err.code == 'ENOENT') {
          // file doens't exist
          console.error("File doesn't exist, won't remove it.");
      } else if (err) {
          // other errors, e.g. maybe we don't have enough permission
          console.error("Error occurred while trying to remove file");
      } else {
          // console.info(`removed`);
      }
      });
    }
    req.user.avatar='';
    req.user.image=false;
    req.user.save()
    .catch(err => console.error(err));
    res.sendStatus(200);
};

exports.userGift = (req, res) => {
  if(req.user.gift!=''){
    res.sendStatus(204);
    return;
  }

  if(req.params.code)
  {
    let code=parseInt(req.params.code,36);
    let d=new Date();
    d.setTime(code)
    User
        .findOne({Created_date:  d, _id: {"$ne" : req.user._id}},"-relevation -status -auth -pushid -__v -hash -salt")
        .then(function (user) {
               if(user)
               {
                if(user.giftCount<20)
                {
                  res.sendStatus(200);
                  req.user.coins+=ADD_COIN_GIFT;
                  req.user.gift=req.params.code;
                  req.user.save()
                  .catch(err => console.error(err));

                  user.coins+=ADD_COIN_GIFT;
                  user.giftCount+=1;
                  user.save()
                  .catch(err => console.error(err));
                }
                else {
                  res.sendStatus(404);
                }
               }
               else
                res.sendStatus(404);

         })
         .catch(err => {
             res.sendStatus(500);
         });
  }
  else
    {
      res.sendStatus(404);
      return;
      // let user=req.user.toObject();
      // delete user.hash;
      // delete user.salt;
      // res.json(user);
    }
};
