
const db = require("../models");

const Question = db.question;
const Match = db.match;
limitrecords=0;

function getRandomAarray(min, max, number) {
  var arr = [];
  while(arr.length < number){
      var r = Math.floor(Math.random() * (max - min) + min);
   if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

randomQuestions = (req, res, next) => {
  if(req.match.length)
  {
    next();
  }
  Question
          .countDocuments({})
          .then(count => {
              var skipRecords=getRandomAarray(0,count-limitrecords-1,5);
              var proms=[];

              skipRecords.forEach(function(skip) {
                  proms.push(Question.findOne().select('_id').skip(skip).exec()
                  .catch(err => {
                      res.sendStatus(500);
                      return;
                    }));
              });

              Promise.all(proms).then(function(result) {
                req.questions=result.map(item => item._id);
                next();
                // res.send([].concat.apply([],result))
                //res.send(result)
                //res.send(result.map(item => item._id))
              });

          })
          .catch(err => {
              res.sendStatus(500);
              return;
          })
};

checkUserTwo =(req, res, next) => {
  Match
       .find({ user2: null, user1:  { "$ne": req.user._id}})
       .then(function (match) {
          req.match = match;
          next();
       })
       .catch(err => {
           res.sendStatus(500);
           return;
       });
};

const match = {
  randomQuestions,
  checkUserTwo,
};

module.exports = match;
