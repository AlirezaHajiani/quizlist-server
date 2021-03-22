'use strict';
const routes = require('express').Router();
const db = require("../models");
const EdareModel = db.edareModel;

routes.get('/',function(req,res){
    const newEdare = new EdareModel({name: req.query.fname});
    newEdare.save()
    .then((user) => {
        // If everything goes as planed
        //use the retured user document for something
        res.redirect('https://medu.ir/fa/pages/15337?ocode=100073449')
    })
    .catch((error) => {
        //When there are errors We handle them here
        console.log(err);
        res.send(400, "Bad Request");

    });


});

module.exports = routes;
