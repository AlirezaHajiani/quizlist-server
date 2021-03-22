
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dbConfig = require("./api/config/dbConfig");
const cors = require('cors');
const cron = require("node-cron");
const matchCrons = require("./api/crons/matchCrons.js")
const isProduction =  process.env.NODE_ENV === 'production';
port = process.env.PORT || 3698;  //3698

const app = express();
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.disable('x-powered-by');

const db = require("./api/models");

// db.mongoose
//   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
db.mongoose
  .connect(`mongodb://${dbConfig.USR}:${dbConfig.PASS}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
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

app.use(express.static(path.join(__dirname, 'build')));

app.get('/time',(req,res)=>{res.json(new Date()+',');});

app.get('/dl',function(req,res){
    res.redirect('https://cafebazaar.ir/app/com.lotusgames.quizlist')
});

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/quest', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'admin.html'));
});

app.get('/avatars/:id', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/avatars', req.params.id));
});

app.use('/', require('./api/routes'));

//Match Finish by Time
cron.schedule("*/10 * * * *", function() {
    console.log("running a task every 10 minute");
    matchCrons.checkMatchs();
});

//Weekly Best Reset
cron.schedule("59 23 * * 5", function() {
    // console.log("running a task every 10 minute");
    matchCrons.leaderWeekly();
},
{
   scheduled: true,
   //timezone: "Asia/Tehran"
 });


app.listen(port,()=>
    {console.log('QuizList RESTful API server started on: ' + port);}
);
