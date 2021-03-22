'use strict';
const routes = require('express').Router();
var iapController = require('../controllers/iapController');
const { authJwt } = require("../middlewares");

routes.get('/coins',iapController.coins);

routes.post('/purchase',[authJwt.verifyToken],iapController.purchase);
routes.post('/adcoin',[authJwt.verifyToken],iapController.adcoin);
// routes.use('/',[authJwt.verifyToken]);

module.exports = routes;
