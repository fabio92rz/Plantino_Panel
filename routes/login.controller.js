/**
 * Created by Fabio on 28/02/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var userModel = require('./../models/user.model');
var plantSpec = require('./../models/plant.model');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    res.render('login');
});

var sess;
router.post('/', function (req, res) {


    console.log("richiesta ricevuta");

    var loginMail = req.body.registerMail;
    var loginPassword = req.body.registerPass1;
    var user;
    var state = "";

    db.query("SELECT * FROM user where mail = ? and password = ?", [loginMail, loginPassword], ['id', 'name', 'mail', 'password'], function (err, rows) {

        user = JSON.stringify(rows.length && rows[0]);
        var userContent = JSON.parse(user);

        var userId = userContent.id;
        var userName = userContent.name;
        var userMail = userContent.mail;
        var userPass = userContent.password;

        //console.log(db.query("SELECT * FROM user where mail = ? and password = ?",[mail, password], ['id', 'name', 'mail', 'password']));

        if (userMail == loginMail && userPass == loginPassword) {

            db.query("SELECT * FROM selectedPlant where id = '?' ", [1], ['id', 'plantName', 'minTemp', 'maxTemp', 'minHum', 'maxHum', 'minLight', 'maxLight'], function (err, rows) {

                var registeredPlant = JSON.stringify(rows.length && rows[0]);
                var plantContent = JSON.parse(registeredPlant);

                plantSpec.name = plantContent.plantName;
                plantSpec.minTemp = plantContent.minTemp;
                plantSpec.maxTemp = plantContent.maxTemp;
                plantSpec.minHum = plantContent.minHum;
                plantSpec.maxHum = plantContent.maxHum;
                plantSpec.minLight = plantContent.minLight;
                plantSpec.maxLight = plantContent.maxLight;

                console.log(plantSpec);

                userModel.id = userId;
                userModel.name = userName;
                userModel.mail = userMail;

                console.log("Username", userModel);

                sess = req.session;
                userModel.token = sess.email = userModel.mail;
                sess.admin = true;

                state = "success";
                res.render('home', {user: JSON.stringify(userModel.name), userPlant: JSON.stringify(plantSpec)});

            });

        } else {

            state = "failed";
            res.render('login', {data: JSON.stringify(state)});
        }

    });
});

module.exports = router;

