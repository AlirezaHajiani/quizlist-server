const db = require("../models");
var pushPole=require('../services/pushPole.js');
const Match = db.match;
const User = db.user;
const WeeklyBest = db.weeklybest;

const {ADD_SCORE_VALUE,ADD_COIN_VALUE} = require('../config/gameConst.js');

exports.checkMatchs= () =>{
  var date = new Date();
  date.setDate(date.getDate() - 1);
  Match
       .find({ user2: {"$ne" : null}, finished : false, Updated_date: {"$lt": date}})
       .then(function (matches) {
          matches.forEach((match)=>{
            match.round=4;
            match.finished=true;
            match.timeUp=true;
            if(match.turn==1){
              match.winner=2;
              User.findById(match.user2._id)
              .then((user)=>{
                user.score+=(ADD_SCORE_VALUE+match.score2.reduce((a, b) => a + b, 0));
                user.weekscore+=(ADD_SCORE_VALUE+match.score2.reduce((a, b) => a + b, 0));
                // let totalAnswer=user.answer1.reduce((t,c)=>t+c.length,0);
                let totalCorrect=match.answer2.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                let totalCorrect2=match.answer2.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                let totalCorrect3=match.answer2.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);
                user.coins += ADD_COIN_VALUE;
                user.meancorrect=((user.meancorrect*user.matches)+totalCorrect*2)/(user.matches+1);
                user.meantwo=((user.meantwo*user.matches)+totalCorrect2*2)/(user.matches+1);
                user.meanthree=((user.meanthree*user.matches)+totalCorrect3*2)/(user.matches+1);
                user.matches+=1;
                user.wons+=1;
                user.markModified('coins');
                user.markModified('score');
                user.markModified('weekscore');
                user.markModified('matches');
                user.markModified('wons');
                user.save().catch(err=>console.log(err))
              })
              .catch(err=>console.log(err))

              User.findById(match.user1._id)
              .then((user)=>{
                user.score+=(-ADD_SCORE_VALUE);
                user.weekscore+=(-ADD_SCORE_VALUE);
                let totalCorrect=match.answer1.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                let totalCorrect2=match.answer1.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                let totalCorrect3=match.answer1.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);
                user.coins -= ADD_COIN_VALUE;
                if(user.coins<0)user.coins=0;
                user.meancorrect=((user.meancorrect*user.matches)+totalCorrect*2)/(user.matches+1);
                user.meantwo=((user.meantwo*user.matches)+totalCorrect2*2)/(user.matches+1);
                user.meanthree=((user.meanthree*user.matches)+totalCorrect3*2)/(user.matches+1);
                user.matches+=1;
                user.markModified('coins');
                user.markModified('score');
                user.markModified('weekscore');
                user.markModified('matches');
                user.save().catch(err=>console.log(err));
              })
              .catch(err=>console.log(err));
            }
            else if (match.turn==2) {
              match.winner=1;
              User.findById(match.user1._id)
              .then((user)=>{
                user.score+=(ADD_SCORE_VALUE+match.score1.reduce((a, b) => a + b, 0));
                user.weekscore+=(ADD_SCORE_VALUE+match.score1.reduce((a, b) => a + b, 0));
                user.coins += ADD_COIN_VALUE;
                // let totalAnswer=user.answer1.reduce((t,c)=>t+c.length,0);
                let totalCorrect=match.answer1.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                let totalCorrect2=match.answer1.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                let totalCorrect3=match.answer1.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);

                user.meancorrect=((user.meancorrect*user.matches)+totalCorrect*2)/(user.matches+1);
                user.meantwo=((user.meantwo*user.matches)+totalCorrect2*2)/(user.matches+1);
                user.meanthree=((user.meanthree*user.matches)+totalCorrect3*2)/(user.matches+1);
                user.matches+=1;
                user.wons+=1;
                user.markModified('score');
                user.markModified('weekscore');
                user.markModified('matches');
                user.markModified('wons');
                user.save().catch(err=>console.log(err))
              })
              .catch(err=>console.log(err))

              User.findById(match.user2._id)
              .then((user)=>{
                user.score+=(-ADD_SCORE_VALUE);
                user.weekscore+=(-ADD_SCORE_VALUE);
                let totalCorrect=match.answer2.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                let totalCorrect2=match.answer2.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                let totalCorrect3=match.answer2.reduce((total,current)=>
                                 {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);

                user.coins -= ADD_COIN_VALUE;
                if(user.coins<0)user.coins=0;
                user.meancorrect=((user.meancorrect*user.matches)+totalCorrect*2)/(user.matches+1);
                user.meantwo=((user.meantwo*user.matches)+totalCorrect2*2)/(user.matches+1);
                user.meanthree=((user.meanthree*user.matches)+totalCorrect3*2)/(user.matches+1);
                user.matches+=1;
                user.markModified('coins');
                user.markModified('score');
                user.markModified('weekscore');
                user.markModified('matches');
                user.save().catch(err=>console.log(err));
              })
              .catch(err=>console.log(err));

            }

            for (var i = match.score1.length; i < 5; i++) {
              match.score1.push(0);
            }

            for (var i = match.score2.length; i < 5; i++) {
              match.score2.push(0);
            }

            for (var i = match.answer1.length; i < 5; i++) {
              match.answer1.push([]);
            }

            for (var i = match.answer2.length; i < 5; i++) {
              match.answer2.push([]);
            }

            match.save();
            // console.log(match);
          })

       })
       .catch(err => {
          console.error(err);
       });

       var dateStart = new Date();
       dateStart.setMinutes(dateStart.getMinutes() - 1380);
       var dateEnd = new Date();
       dateEnd.setMinutes(dateEnd.getMinutes() - 1370);

       Match
            .find({ user2: {"$ne" : null}, finished : false, Updated_date: {"$gte":dateStart, "$lt": dateEnd}})
            .then(function (matches) {
                matches.forEach((match)=>{
                  match
                    .populate("user1 user2", "_id name pushid")
                    .execPopulate()
                    .then(function (match2) {
                      if(match.turn==1){
                          console.log("Turn1:"+match2.user1.pushid+","+match2.Updated_date);
                          console.log(match);
                          // pushPole.pushTimeLimit(match2.user1.pushid,match2.user2.name);
                      }
                      else if (match.turn==2) {
                            console.log("Turn2:"+match2.user2.pushid+","+match2.Updated_date);
                          // console.log("Turn2");
                          console.log(match);
                          // pushPole.pushTimeLimit(match2.user2.pushid,match2.user1.name);
                      }
                    })
                    .catch(err=>console.error(err));
                })
            })
            .catch(err => {
               console.error(err);
            });

      var dateEndOnline = new Date();
      dateEndOnline.setMinutes(dateEnd.getMinutes() - 40);
      User
          .updateMany({Updated_date: {"$lt": dateEndOnline}, online: true},{$set: {online: false}},function(err, result) {
              if (err) {
                  console.error(err);
              }
            }
          );

}

exports.leaderWeekly = () => {
  User
      .find({},"-coins -relevation -status -Updated_date -pushid -auth -__v -hash -salt")
      .sort({weekscore:-1,Created_date: 1})
      .limit(100)
      .lean()
      .then((users)=>{
        users.forEach((value,index)=>value.key=index+1);
        const weekly = new WeeklyBest({scores: JSON.stringify(users)});
        weekly.save();
        User.updateMany({},{ $set: { weekscore: 1500 } },function(err, result) {
            if (err) {
                console.error(err);
            }
          }
        );
      })
      .catch(err => {
                    console.error(err);
      });
}
