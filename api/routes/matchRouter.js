'use strict';
const routes = require('express').Router();
var matchController = require('../controllers/matchController');
const { authJwt, match } = require("../middlewares");

routes.use('/',[authJwt.verifyToken]);

// routes.get('/quest',[match.randomQuestions],matchController.allQuestions);
routes.post('/',[match.checkUserTwo],[match.randomQuestions],matchController.newMatch);
routes.post('/:userId',[(req, res, next)=>{req.match=[];next();}],[match.randomQuestions],matchController.newMatchWithUser2)
routes.get('/all',matchController.getAllMatch)
routes.get('/:id',matchController.getMatch)
routes.put('/:id',matchController.updateMatch)
routes.post('/flag/:id',matchController.flagMatch)
routes.post('/suggestion/:match/:question/:answer',matchController.suggestAnswer);

module.exports = routes;
