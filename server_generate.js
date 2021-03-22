const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require("./api/config/dbConfig");

const isProduction =  process.env.NODE_ENV === 'production';
port = process.env.PORT || 3000;

// const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
// app.use(bodyParser.json());
// app.disable('x-powered-by');

const db = require("./api/models");
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  const createTutorial = function(question) {
    return db.question.create(question).then(docQuestion => {
      console.log("\n>> Created Question:\n", docQuestion);
      return docQuestion;
    });
  };

  const run = async function() {
    var question = await createTutorial({
      question: "رنگ ها",
      answer1: ["زرد","قرمز","آبی","سبز"],
      answer2: ["بنفش","نیلی","صورتی"],
      answer3: ["ارغوانی","خاکستری"],
    });
    console.log("\n>> question:\n", question);
};

run();
// app.use('/', require('./api/routes'));

// app.listen(port, ()=>
//     {console.log('Advertise RESTful API server started on: ' + port);}
// );
