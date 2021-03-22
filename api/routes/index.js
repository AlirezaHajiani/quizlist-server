var routes = require('express').Router();

const user=require('./userRouter');
const match=require('./matchRouter');
const question=require('./questionRouter');
const leader=require('./leaderboardRouter');
const iap=require('./iapRouter');

const edare=require('./edareRouter');
// var pushPole=require('../services/pushPole.js');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// routes.get('/pushtest', (req, res) => {
//   pushPole.pushTest();
//   res.status(200).json({ message: 'Connected!' });
// });

routes.use('/user', user);
routes.use('/match', match);
routes.use('/question', question);
routes.use('/leaderboard', leader);
routes.use('/iap', iap);

routes.use('/edare', edare);

module.exports = routes;
