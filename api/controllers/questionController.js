const db = require("../models");
const Question = db.question;

exports.allQuestions = (req, res) => {
  Question
          .find({})
          .skip(0)
          .limit(5)
          .then(
            function (questions) {
              res.send(questions);
            }
          )
          .catch(err => {
                res.sendStatus(500);
            }
          );
 //  Question.find({}).then(function (questions) {
 //    res.send(questions);
 // });
};

exports.searchQuestion = (req, res) => {
  Question
          .find({question: { $regex: '.*' + req.params.question + '.*' }})
          .skip(0)
          .limit(5)
          .then(
            function (questions) {
              res.send(questions);
            }
          )
          .catch(err => {
                res.sendStatus(500);
            }
          );
 //  Question.find({}).then(function (questions) {
 //    res.send(questions);
 // });
};

exports.newQuestion = (req, res) => {
  console.log("New Question");
  console.log(req.body);
  if(req.body.question)
  {
    const newQuestion = new Question(req.body);
    newQuestion.save()
    .then(()=> {
      res.send(newQuestion);
    });
  }
  else {
    res.sendStatus(500);
  }
};

exports.updateQuestion = (req, res) => {
  // console.log("update Question");
  // console.log(req.body);
  if(req.body)
  {
    const newQuestion=
    Question
        .findOne({_id: req.params.id})
         .then(function (question) {
             question.question=req.body.question;
             question.markModified('question');
             question.answer1 =req.body.answer1;
             question.markModified('answer1');
             question.answer2 =req.body.answer2;
             question.markModified('answer2');
             question.answer3 =req.body.answer3;
             question.markModified('answer3');
             question.save()
             .then((questionresult)=>{
                res.send(questionresult);
              })
              .catch(err => {
                  res.sendStatus(500);
              });
         })
         .catch(err => {
             res.sendStatus(500);
         });
  }
  else {
    res.sendStatus(500);
  }
};
