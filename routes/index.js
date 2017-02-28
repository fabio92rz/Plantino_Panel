var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//var User = require('../models/user.model');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Plantino' });
});

router.post('/index', function (req, res) {
    var name = req.body.userName;
    var mail = req.body.userMail;
    var password = req.body.userPass1;
    var password2 = req.body.userPass2;

    req.checkBody('name', 'Nome richiesto').notEmpty();
    req.checkBody('mail', 'Email richiesta').notEmpty();
    req.checkBody('mail', 'Email non valida').isEmail();
    req.checkBody('password', 'Password richiesta').notEmpty();
    req.checkBody('password2', 'Le password non combaciano').equals(req.body.userPass1);

    var errors = req.validationErrors();

    if (errors){
        res.render('index', {
            errors:errors
        });
    }else {

        var stmt = db.prepare("INSERT INTO user (name, mail, password) VALUES (?,?,?)");
                        stmt.run([name, mail, password]).finalize();

        req.flash('success msg', 'Ti sei registrato ed ora puoi effettuare il login');
    }
});

module.exports = router;