
const db = require("../models");
const User = db.user;
const {LEADER_TOP_BUTTOM} = require('../config/gameConst.js');

exports.leaderTotal = (req, res) => {
  User
      .find({},"-coins -relevation -status -Updated_date -pushid -auth -__v -hash -salt")
      .sort({score:-1,Created_date: 1})
      .limit(100)
      .lean()
      .then((users)=>{
        users.forEach((value,index)=>value.key=index+1);
        res.json(users);
      })
      .catch(err => {
                    res.sendStatus(500);
                    return;
      });
}

exports.leaderWeekly = (req, res) => {
  User
      .find({},"-coins -relevation -status -Updated_date -pushid -auth -__v -hash -salt")
      .sort({weekscore:-1,Created_date: 1})
      .limit(100)
      .lean()
      .then((users)=>{
        users.forEach((value,index)=>value.key=index+1);
        res.json(users);
      })
      .catch(err => {
                    res.sendStatus(500);
                    return;
      });
}

exports.leaderUser = (req, res) => {

  User
     .aggregate(
     [
       {
         $match:{
           $or:[
             {
               score:{ $gt: req.user.score}
             },
             {
               $and:[{score:{ $eq: req.user.score}},{Created_date: {$lt: req.user.Created_date}}]
             }
           ]

         }
       },
       {
         $count: "rank"
       }
     ],function(err, rank) {
       if (err)
          res.sendStatus(500);
      else {
        var userRank=rank.length?rank[0].rank+1:1;
        var proms=[];
        proms.push(User
                      .find({$or:[
                                  {
                                    score:{ $gt: req.user.score}
                                  },
                                  {
                                    $and:[{score:{ $eq: req.user.score}},{Created_date: {$lte: req.user.Created_date}}]
                                  }
                                ]},"-coins -relevation -status -Updated_date -pushid -auth -__v -hash -salt")
                      .sort({score:-1,Created_date: 1})
                      .skip(userRank>=LEADER_TOP_BUTTOM?userRank-LEADER_TOP_BUTTOM:0)
                      .limit(LEADER_TOP_BUTTOM)
                      .lean());
        proms.push(User
                      .find({$or:[
                                  {
                                    score:{ $lt: req.user.score}
                                  },
                                  {
                                    $and:[{score:{ $eq: req.user.score}},{Created_date: {$gt: req.user.Created_date}}]
                                  }
                                ]},"-coins -relevation -status -Updated_date -pushid -auth -__v -hash -salt")
                      .sort({score:-1,Created_date: 1})
                      .limit(LEADER_TOP_BUTTOM)
                      .lean());
        Promise.all(proms).then( ([usersTop,usersBottom])=>{
          usersTop.slice().reverse().forEach((value,index)=>value.key=userRank-index);
          usersBottom.forEach((value,index)=>value.key=userRank+index+1);
          res.json(usersTop.concat(usersBottom));
          // res.json({...user,total:total,rank:rank.length?rank[0].rank+1:1}
        });
      }
    })
    .catch(err => {res.send(err);return;});


  // User
  //     .find({},"-coins -relevation -status -Updated_date -pushid -auth -__v")
  //     .sort({score:-1,Created_date: 1})
  //     .limit(100)
  //     .lean()
  //     .then((users)=>{
  //       users.forEach((value,index)=>value.key=index+1);
  //       res.json(users);
  //     })
  //     .catch(err => {
  //                   res.sendStatus(500);
  //                   return;
  //     });
}
