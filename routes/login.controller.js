/**
 * Created by Fabio on 28/02/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var bcrypt = require('bcrypt-nodejs');

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    res.render('login');
});


router.post('/', function (req, res) {

    console.log("richiesta ricevuta");

    var loginMail = req.body.registerMail;
    var loginPassword = req.body.registerPass1;
    var user;
    var state = "";

    db.query("SELECT * FROM user where mail = ? and password = ?",[loginMail, loginPassword], ['id', 'name', 'mail', 'password'], function (err, rows) {

        user = JSON.stringify(rows.length && rows[0]);
        var userContent = JSON.parse(user);

        var userId = userContent.id;
        var userName = userContent.name;
        var userMail = userContent.mail;
        var userPass = userContent.password;

        console.log("Username", userName);
        console.log("Usermail", userMail);
        console.log("Userpass", userPass);
        console.log("Useris", userId);


        //console.log(db.query("SELECT * FROM user where mail = ? and password = ?",[mail, password], ['id', 'name', 'mail', 'password']));

        if (userMail == loginMail && userPass == loginPassword){

            state = "success";
            res.render('home', {data: JSON.stringify(state)});

        }else {

            state = "failed";
            res.render('login', {data: JSON.stringify(state)});
        }

    });
});

module.exports = router;

