'use strict';
const routes = require('express').Router();
var questionController = require('../controllers/questionController');
const { authJwt } = require("../middlewares");

routes.use('/',[authJwt.verifyQToken]);

routes.get('/all',questionController.allQuestions);
routes.get('/all/:question',questionController.searchQuestion);
routes.post('/new',questionController.newQuestion);
routes.put('/:id',questionController.updateQuestion);
module.exports = routes;
