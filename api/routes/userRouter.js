'use strict';
const routes = require('express').Router();
var userController = require('../controllers/userController');
const { authJwt, push } = require("../middlewares");

routes.post('/', userController.newUser);
routes.post('/login', userController.signin);
routes.use('/',[authJwt.verifyToken],[push.checkPushId]);

routes.get('/profile/:id', userController.userProfile);
routes.get('/', userController.userData);
routes.put('/', userController.userUpdate);
routes.get('/search/:name', userController.userSearch);
routes.get('/check/:name', userController.userNameCheck);
routes.post('/gift/:code', userController.userGift);
routes.post('/avatar', userController.userAvatar);
routes.post('/avatarRM', userController.userAvatarRM);
module.exports = routes;
