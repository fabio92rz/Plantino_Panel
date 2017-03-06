/**
 * Created by Fabio on 06/03/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport-local');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/', function (req, res) {
    var name = req.body.registerName;
    var mail = req.body.registerMail;
    var password = req.body.registerPass1;
    var password2 = req.body.registerPass2;

    if (password!=password2){
        res.render('register', {
            errors:errors
        });
    }else{

        db.query("INSERT INTO user (name, mail, password) VALUES (?, ?, ?)", [name, mail, password]);
        res.redirect('register', sweetAlert("Grande!", "Registrazione effettuata.", "success"));
    }
});

module.exports = router;

