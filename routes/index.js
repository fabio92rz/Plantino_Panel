var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//var User = require('../models/user.model');
var dblite = require('dblite');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
db = dblite('/opt/plantinoServer/plantino_record.db');

router.post('index', function (req, res) {
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

        //var stmt = db.query("INSERT INTO user (name, mail, password) VALUES (?,?,?)");
                        //stmt.run([name, mail, password]).finalize();
        db.query("INSERT INTO user (name, mail, password) VALUES (?, ?, ?)", [name], [mail], [password]);
        req.flash('success msg', 'Ti sei registrato ed ora puoi effettuare il login');
        res.redirect('/')
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Plantino' });
});

module.exports = router;