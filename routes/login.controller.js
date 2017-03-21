/**
 * Created by Fabio on 28/02/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    res.render('login');
});


router.post('/', function (req, res) {

    console.log("richiesta ricevuta");

    var mail = req.body.registerMail;
    var password = req.body.registerPass1;
    var userMail;
    var userPass;
    var state = "";

    db.query("SELECT * FROM user where mail = ? and password = ?",[mail, password], ['id', 'name', 'mail', 'password'], function (err, rows) {
        userMail = rows[0];
        console.log(db.query("SELECT * FROM user where mail = ? and password = ?",[mail, password], ['id', 'name', 'mail', 'password']));

        if (userMail === true){

            state = "failed";
            res.render('index', {data: JSON.stringify(state)});

        }else {

            state = "success";
            res.render('index', {data: JSON.stringify(state)});
        }

    });
});

module.exports = router;

