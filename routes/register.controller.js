/**
 * Created by Fabio on 06/03/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    res.render('register');
});

/**var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest;

xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200){
        document.getElementsByTagName(state).innerhtml = xhr.responseText;
    }

    xhr.open("POST", "http://localhost:1024/register", true);
    xhr.send();

};**/


router.post('/', function (req, res) {

        console.log("richiesta ricevuta");

        var name = req.body.registerName;
        var mail = req.body.registerMail;
        var password = req.body.registerPass1;
        var password2 = req.body.registerPass2;
        var registeredUser;
        var state = "";

        db.query("SELECT * FROM user where mail = ?",[mail], function (err, rows) {
            registeredUser = rows[0];

            if (registeredUser || registeredUser==false || password!=password2 ){

                state = "failed";
                res.render('index', {data: JSON.stringify(state)});

            }else {

                db.query("INSERT INTO user (name, mail, password) VALUES (?, ?, ?)", [name, mail, password]);
                state = "success";
                res.render('index', {data: JSON.stringify(state)});
            }

        });
});

module.exports = router;

