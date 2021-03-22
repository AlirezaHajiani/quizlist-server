const db = require("../models");
var pushPole=require('../services/pushPole.js');
const crypto = require('crypto');
// Difining algorithm
const algorithm = 'aes-256-cbc';

// Defining key
const key = 'jWnZr4u7x!A%D*G-';

// Defining iv
const iv = '2s5v8y/B?E(H+MbQ';


const {ADD_SCORE_VALUE,ADD_COIN_VALUE,ADD_COIN_VALUE_EQUAL} = require('../config/gameConst.js');

const User = db.user;
const Question = db.question;
const Match = db.match;
const Suggestion = db.suggestion;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// exports.allQuestions = (req, res) => {
//     res.send(req.questions);
//  //  Question.find({}).then(function (questions) {
//  //    res.send(questions);
//  // });
// };


exports.newMatch = (req, res) => {
    // console.log(req.match);
    if(req.match.length)
    {
      // let rand=getRandomInt(0,req.match.length-1)
      const newMatch=req.match[0];
      newMatch.user2=req.user._id;
      newMatch.markModified('user2');
      newMatch.save()
      .then((match)=>{
        match.questions=match.questions.slice(0,match.round+1);
        match
        .populate("user1 user2", "_id name avatar online")
        .populate("questions", "-active -good -bad -Created_date -__v")
        .execPopulate()
        .then(function (match2) {
               // console.log(match2);
               res.send(encryptObject(match2.toObject()));
               return;
               // res.send(match2);
         })
         .catch(err => {
             res.sendStatus(500);
             console.error(err);
         });
      })
      .catch(err => console.error(err));
    }
    else {
      const newMatch = new Match({user1: req.user._id,
                                  questions: req.questions});
      newMatch.save()
      .then(()=> {
                   newMatch.questions=newMatch.questions[0];
                   newMatch
                   .populate("user1 user2", "_id name avatar online")
                   .populate("questions", "-active -good -bad -Created_date -__v")
                   .execPopulate()
                   .then(function (match) {
                          // match.questions=match.questions[0];
                          res.send(encryptObject(match.toObject()));
                          // res.send(match);
                    })
                    .catch(err => {
                        res.sendStatus(500);
                        console.error(err);
                    });
           })
      .catch(err => {
          res.sendStatus(500);
          console.error(err);
      })
    }
    //console.log("New Match");
    //res.send(req.questions);
};

exports.newMatchWithUser2 = (req, res) => {
  var matchDuplicate=false;
  Match
       .find({$and: [
                      {finished:false},
                      {$or: [
                              { user2: req.params.userId, user1:  req.user._id},
                              { user1: req.params.userId, user2:  req.user._id}
                            ]
                      }]})
       .then(function (match) {
                               if(match.length)
                               {
                                 match[0].questions=match[0].questions.slice(0,match[0].round+1);
                                 match[0]
                                 .populate("user1 user2", "_id name avatar online")
                                 .populate("questions", "-active -good -bad -Created_date -__v")
                                 .execPopulate()
                                 .then(function (match2) {
                                                          // match.questions=match.questions[0];
                                                          if(match2.round>0)
                                                          {
                                                            if(isEven(match2.round))
                                                            {
                                                              if(req.user._id.toString()==match2.user2._id.toString())
                                                              {
                                                                if(!Array.isArray(match2.answer1[match2.round]))
                                                                {
                                                                  match2.round-=1;
                                                                }
                                                              }
                                                            }
                                                            else
                                                            {
                                                              if(req.user._id.toString()==match2.user1._id.toString())
                                                              {
                                                                if(!Array.isArray(match2.answer2[match2.round]))
                                                                {
                                                                  match2.round-=1;
                                                                }
                                                              }
                                                            }
                                                          }
                                                          // res.send(match2);
                                                          res.send(encryptObject(match2.toObject()));
                                                          return;
                                                })
                                 .catch(err => {
                                      res.sendStatus(500);
                                      console.error(err);
                                      return;
                                  });
                               }
                               else {
                                 User.findById(req.params.userId)
                                      .then((user)=>{
                                        if(user)
                                        {
                                          const newMatch = new Match({user1: req.user._id,
                                                                      user2: user._id,
                                                                      questions: req.questions});

                                          newMatch.save()
                                          .then(()=> {
                                                       newMatch.questions=newMatch.questions[0];
                                                       newMatch
                                                       .populate("user1 user2", "_id name avatar online")
                                                       .populate("questions", "-active -good -bad -Created_date -__v")
                                                       .execPopulate()
                                                       .then(function (match) {
                                                              // match.questions=match.questions[0];
                                                              // res.send(match);
                                                              res.send(encryptObject(match.toObject()));
                                                              return;
                                                        })
                                                        .catch(err => {
                                                            res.sendStatus(500);
                                                            console.error(err);
                                                        });
                                               })
                                          .catch(err => {
                                              res.sendStatus(500);
                                              console.error(err);
                                          })
                                          pushPole.pushGameChallenge(user.pushid,req.user.name);
                                        }
                                        else {
                                          res.sendStatus(500);
                                          console.error(err);
                                        }
                                      }
                                      )
                                      .catch(err => {
                                          res.sendStatus(500);
                                          console.error(err);
                                      })
                               }
                         })
       .catch(err => {
           res.sendStatus(500);
           console.error(err);
           return;
       });

};

exports.getMatch =  (req, res) => {
  Match
       .findOne({_id: req.params.id})
       .populate("user1 user2", "_id name avatar online")
       .then(function (match) {
              match.questions=match.questions.slice(0,match.round+1);
              match
              .populate("questions", "-active -good -bad -Created_date -__v")
              .execPopulate()
              .then(function (match2) {
                     // match.questions=match.questions[0];
                     if(match2.round>0)
                     {
                       if(isEven(match2.round))
                       {
                         if(req.user._id.toString()==match2.user2._id.toString())
                         {
                           if(!Array.isArray(match2.answer1[match2.round]))
                           {
                             match2.round-=1;
                           }
                         }
                       }
                       else
                       {
                         if(req.user._id.toString()==match2.user1._id.toString())
                         {
                           if(!Array.isArray(match2.answer2[match2.round]))
                           {
                             match2.round-=1;
                           }
                         }
                       }
                     }
                     // let cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key) ,iv);
                     // let matchJson=JSON.stringify(match2.toObject());
                     // let encrypted = cipher.update(matchJson);
                     // encrypted = Buffer.concat([encrypted, cipher.final()]);

                     // let decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key), iv);
                     // let encryptedText = Buffer.from(encrypted, 'hex');
                     // let decrypted = decipher.update(encryptedText);
                     // decrypted = Buffer.concat([decrypted, decipher.final()]);
                     // decrypted.toString()
                     res.send(encryptObject(match2.toObject()));
                     // res.send(decrypted.toString());
                     //res.send(matchObj);
               })
               .catch(err => {
                   res.sendStatus(500);
               });
        })
        .catch(err => {
            res.sendStatus(500);
        });
        //console.log("Get Match");
}

function encryptObject(obj)
{
  let cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key) ,iv);
  let matchJson=JSON.stringify(obj);
  let encrypted = cipher.update(matchJson);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('base64')
}

function decryptObject(text)
{
  let decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key), iv);
  let encryptedText = Buffer.from(text, 'base64');
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
  // let cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key) ,iv);
  // let matchJson=JSON.stringify(obj);
  // let encrypted = cipher.update(matchJson);
  // encrypted = Buffer.concat([encrypted, cipher.final()]);
  // return encrypted.toString('base64')
}

function isEven(n) {
   return n % 2 == 0;
}

exports.updateMatch = (req, res) => {
  req.body = decryptObject(req.body.data);
  // res.json(req.body);
  var updated=false;
  const newMatch=
  Match
       .findOne({_id: req.params.id})
       .then(function (match) {

         // res.json('OK');
         //console.log("updateMatch");
         if(Array.isArray(req.body.answer1[match.round]))
         {
           if(!Array.isArray(match.answer1[match.round]))
           {
              match.answer1[match.round]=[];
              match.answer1[match.round]=req.body.answer1[match.round];
              match.markModified('answer1');
              match.turn=2;
              match.markModified('turn');
              updated=true;
           }
         }
         if(Array.isArray(req.body.answer2[match.round]))
         {
           if(!Array.isArray(match.answer2[match.round]))
           {
              match.answer2[match.round]=[];
              match.answer2[match.round]=req.body.answer2[match.round];
              match.markModified('answer2');
              match.turn=1;
              match.markModified('turn');
              updated=true;
           }
         }
         if(!match.finished)
         if(Array.isArray(match.answer1[match.round]))
           if(Array.isArray(match.answer2[match.round]))
           {
             let score1=0;
             let score2=0;
             match.answer1[match.round].forEach((item, i) => {
               score1+=item[1];
             });
             match.answer2[match.round].forEach((item, i) => {
               score2+=item[1];
             });
             match.score1.push(score1);
             match.score2.push(score2);
             if(score1>score2)
             {
               match.score1total+=1;
               match.markModified('score1total');
             }
             else if(score1<score2)
             {
               match.score2total+=1;
               match.markModified('score2total');
             }

             if(isEven(match.round))
             {
               match.turn=2;
               match.markModified('turn');
             }
             else {
               match.turn=1;
               match.markModified('turn');
             }

             if(match.round==4)
             {
               match.finished=true;
               match.markModified('finished');
               if(match.score1total>match.score2total)
               {
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
                   user.score+=(-ADD_SCORE_VALUE+match.score2.reduce((a, b) => a + b, 0));
                   user.weekscore+=(-ADD_SCORE_VALUE+match.score2.reduce((a, b) => a + b, 0));
                   let totalCorrect=match.answer2.reduce((total,current)=>
                                    {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                   let totalCorrect2=match.answer2.reduce((total,current)=>
                                    {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                   let totalCorrect3=match.answer2.reduce((total,current)=>
                                    {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);

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
               else if(match.score1total<match.score2total){
                 match.winner=2;
                 User.findById(match.user2._id)
                 .then((user)=>{
                   user.score+=(ADD_SCORE_VALUE+match.score2.reduce((a, b) => a + b, 0));
                   user.weekscore+=(ADD_SCORE_VALUE+match.score2.reduce((a, b) => a + b, 0));
                   user.coins += ADD_COIN_VALUE;
                   // let totalAnswer=user.answer1.reduce((t,c)=>t+c.length,0);
                   let totalCorrect=match.answer2.reduce((total,current)=>
                                    {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                   let totalCorrect2=match.answer2.reduce((total,current)=>
                                    {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                   let totalCorrect3=match.answer2.reduce((total,current)=>
                                    {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);

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
                   user.score+=(-ADD_SCORE_VALUE+match.score1.reduce((a, b) => a + b, 0));
                   user.weekscore+=(-ADD_SCORE_VALUE+match.score1.reduce((a, b) => a + b, 0));
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
                   user.markModified('score');
                   user.markModified('weekscore');
                   user.markModified('matches');
                   user.save().catch(err=>console.log(err));
                 })
                 .catch(err=>console.log(err));
               }
               else if(match.score1total==match.score2total){
                   match.winner=0;
                   User.findById(match.user2._id)
                   .then((user)=>{
                     user.score+=(match.score2.reduce((a, b) => a + b, 0));
                     user.weekscore+=(match.score2.reduce((a, b) => a + b, 0));
                     user.coins += ADD_COIN_VALUE_EQUAL;
                     // let totalAnswer=user.answer1.reduce((t,c)=>t+c.length,0);
                     let totalCorrect=match.answer2.reduce((total,current)=>
                                      {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                     let totalCorrect2=match.answer2.reduce((total,current)=>
                                      {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                     let totalCorrect3=match.answer2.reduce((total,current)=>
                                      {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);

                     user.meancorrect=((user.meancorrect*user.matches)+totalCorrect*2)/(user.matches+1);
                     user.meantwo=((user.meantwo*user.matches)+totalCorrect2*2)/(user.matches+1);
                     user.meanthree=((user.meanthree*user.matches)+totalCorrect3*2)/(user.matches+1);
                     user.matches+=1;
                     user.markModified('coins');
                     user.markModified('score');
                     user.markModified('weekscore');
                     user.markModified('matches');
                     user.save().catch(err=>console.log(err))
                   })
                   .catch(err=>console.log(err))

                   User.findById(match.user1._id)
                   .then((user)=>{
                     user.score+=(match.score2.reduce((a, b) => a + b, 0));
                     user.weekscore+=(match.score2.reduce((a, b) => a + b, 0));
                     user.coins += ADD_COIN_VALUE_EQUAL;
                     // let totalAnswer=user.answer1.reduce((t,c)=>t+c.length,0);
                     let totalCorrect=match.answer2.reduce((total,current)=>
                                      {return total+current.reduce((t2,c2)=>t2+(c2[1]>0),0);},0);
                     let totalCorrect2=match.answer2.reduce((total,current)=>
                                      {return total+current.reduce((t2,c2)=>t2+(c2[1]==2),0);},0);
                     let totalCorrect3=match.answer2.reduce((total,current)=>
                                      {return total+current.reduce((t2,c2)=>t2+(c2[1]==3),0);},0);

                     user.meancorrect=((user.meancorrect*user.matches)+totalCorrect*2)/(user.matches+1);
                     user.meantwo=((user.meantwo*user.matches)+totalCorrect2*2)/(user.matches+1);
                     user.meanthree=((user.meanthree*user.matches)+totalCorrect3*2)/(user.matches+1);
                     user.matches+=1;
                     user.markModified('coins');
                     user.markModified('score');
                     user.markModified('weekscore');
                     user.markModified('matches');
                     user.save().catch(err=>console.log(err))
                   })
                   .catch(err=>console.log(err));

               }
               match.markModified('winner');

               updated=true;
             }
             else {
               match.round+=1;
                updated=true;
             }
             match.markModified('score1');
             match.markModified('score2');
             match.markModified('round');
             // console.log("RoundUp");
           }

         match.save()
         .then((matchresult)=>{
           matchresult.questions=matchresult.questions.slice(0,matchresult.round+1);
           matchresult
           .populate("user1 user2", "_id name avatar pushid online")
           .populate("questions", "-active -good -bad -Created_date -__v")
           .execPopulate()
           .then(function (match2) {
                  // console.log(match2);
                  let sendnot=true;
                  if(match2.round>0)
                  {
                    if(isEven(match2.round))
                    {
                      if(req.user._id.toString()==match2.user2._id.toString())
                      {
                        if(!Array.isArray(match2.answer1[match2.round]))
                        {
                          match2.round-=1;
                          sendnot=false;
                        }
                      }
                      else
                      {
                        if(!Array.isArray(match2.answer1[match2.round]))
                        {
                          sendnot=false;
                        }
                      }
                    }
                    else
                    {
                      if(req.user._id.toString()==match2.user1._id.toString())
                      {
                        if(!Array.isArray(match2.answer2[match2.round]))
                        {
                          match2.round-=1;
                          sendnot=false;
                        }
                      }
                      else
                      {
                        if(!Array.isArray(match2.answer2[match2.round]))
                        {
                          sendnot=false;
                        }
                      }
                    }
                  }

                  if(sendnot)
                  {
                    if(req.user._id.toString()==match2.user1._id.toString())
                    {
                        if(typeof match2.user2!== 'undefined' && typeof match2.user1!== 'undefined' && updated)
                        {
                          //console.log('user1 push');
                          pushPole.pushGameTurn(match2.user2.pushid,match2.user1.name);
                        }
                    }
                    else {
                        if(typeof match2.user1!== 'undefined' && typeof match2.user2!== 'undefined' && updated)
                        {
                          //console.log('user2 push');
                          pushPole.pushGameTurn(match2.user1.pushid,match2.user2.name);
                        }
                    }
                  }

                  res.send(encryptObject(match2.toObject()));
            })
            .catch(err => {
                res.sendStatus(500);
                console.error(err);
            });
         })
         .catch(err => console.error(err));
       })
       .catch(err => {
           res.sendStatus(500);
           console.error(err);
       });
};

exports.getAllMatch =  (req, res) => {
  Match
       .find({ $or: [{user1: req.user._id}, {user2: req.user._id}], finished: false })
       .select("-questions -relevation1 -relevation2 -Created_date  -__v")
       .sort({'Updated_date': -1})
       .populate("user1 user2", "_id name avatar online")
       .then(function (match) {
          // match.forEach((item, i) => {
          //   item.answer1=item.answer1.length;
          //   item.answer2=item.answer2.length;
          // });

          Match
               .find({ $or: [{user1: req.user._id}, {user2: req.user._id}], finished: true })
               .select("-answer1 -answer2 -questions -relevation1 -relevation2 -Created_date -__v")
               .sort({'Updated_date': -1})
               .limit(20)
               .populate("user1 user2", "_id name avatar online")
               .then(function (match2) {
                    res.send([...match,...match2]);

                })
                .catch(err => {
                           res.sendStatus(500);
                           return;
                 });
          // res.send(match);
       })
       .catch(err => {
           res.sendStatus(500);
           return;
       });
       //console.log("Get All Match");
  // Match
  //      .findOne({_id: req.params.id})
  //      .populate("user1 user2", "_id username")
  //      .then(function (match) {
  //             match.questions=match.questions.slice(0,match.round+1);
  //             match
  //             .populate("questions", "-active -good -bad -Created_date -__v")
  //             .execPopulate()
  //             .then(function (match2) {
  //                    // match.questions=match.questions[0];
  //                    res.send(match2);
  //              })
  //              .catch(err => {
  //                  res.sendStatus(500);
  //              });
  //       })
  //       .catch(err => {
  //           res.sendStatus(500);
  //       });

};

exports.suggestAnswer =  (req, res) => {

  const newSuggestion = new Suggestion({user: req.user._id,
                                        questions: req.params.question,
                                        match: req.params.match,
                                        answer: req.params.answer});
  newSuggestion.save();
  res.sendStatus(200);
};

exports.flagMatch =  (req, res) => {

  Match
       .findOne({_id: req.params.id})
       .populate("user1 user2", "_id name avatar online")
       .populate("questions", "-active -good -bad -Created_date -__v")
       .exec()
       .then(function (match) {
                    match.round=4;
                    match.finished=true;
                    match.flag=true;
                    if(req.user._id.toString()==match.user1._id.toString())
                    {
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
                    if(req.user._id.toString()==match.user2._id.toString()) {
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
                    res.send(encryptObject(match.toObject()));
                    // res.send(match.toObject());

        })
        .catch(err => {
            res.sendStatus(500);
            console.error(err);
        });

};
