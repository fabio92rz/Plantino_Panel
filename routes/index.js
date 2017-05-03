var express = require('express');
var router = express.Router();
var user = require('./../models/user.model.js');


/* GET home page. */
router.get('/', function(req, res, next) {

    if (user.token){
        res.redirect('home');
    }else {
        res.render('index', { title: 'Plantino' });
    }
});


module.exports = router;