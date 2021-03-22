'use strict';
const routes = require('express').Router();
var leaderController = require('../controllers/leaderController');
const { authJwt } = require("../middlewares");

routes.use('/',[authJwt.verifyToken]);

routes.get('/total',leaderController.leaderTotal);
routes.get('/weakly',leaderController.leaderWeekly);
routes.get('/user',leaderController.leaderUser);
module.exports = routes;
