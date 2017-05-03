/**
 * Created by Fabio on 29/03/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var user = require('./../models/user.model.js');
var path = require('path');
var fs = require('fs');


//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

router.get('/', function (req, res, next) {
    var userName = user.name;
    var token = user.token;
    console.log("prova", token);

    if (req.session && req.session.email === token && req.session.admin){
        res.render('home', {user: JSON.stringify(userName)} );
    }else {
        res.redirect('/');
    }
});

router.post('/', function (req, res, next) {
    user.token = "";
    user.name = "";
    req.session.destroy();
    console.log("prova user", user.token);
    res.render('index');

});

router.post('/getImage', function (req, res){
    var tempPath = req.file.path,
        targetPath = path.resolve('./../plantImages/image.jpg');
    if (path.extname(req.file.name).toLowerCase() === '.jpg'){
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload effettuato");
        });
    }else{
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .jpg accepted");

        });
    }
});

router.get('/image.jpeg', function (req, res) {
    res.sendfile(path.resolve('./../plantImages/image.jpg'));
});

router.post('/getPlant', function (req, res) {

    var jsonPlant = req.body;
    var selectedPlant = jsonPlant.plant;
    var minTemp = jsonPlant.minTemp;
    var maxTemp = jsonPlant.maxTemp;
    var minHum = jsonPlant.minHum;
    var maxHum = jsonPlant.maxHum;
    var minLight = jsonPlant.minLight;
    var maxLight = jsonPlant.maxLight;

    console.log(req.body);

    var string = "success";

    db.query("SELECT * FROM selectedPlant where id = '?' ", [1], function (err, rows) {

        var registeredPlant = JSON.stringify(rows.length && rows[0]);
        var plantContent = JSON.parse(registeredPlant);

        console.log(registeredPlant);
        console.log(plantContent);

        if (plantContent.id == 1){

            db.query("UPDATE selectedPlant SET plantName = ?, minTemp = ?, maxTemp = ?, minHum = ?, maxHum = ?, minLight = ?, maxLight = ? WHERE id = ?", [selectedPlant, minTemp, maxTemp, minHum, maxHum, minLight, maxLight, 1]);

        }else {

            db.query("INSERT INTO selectedPlant (plantName, minTemp, maxTemp, minHum, maxHum, minLight, maxLight) VALUES (?, ?, ?, ?, ?, ?, ?)", [selectedPlant, minTemp, maxTemp, minHum, maxHum, minLight, maxLight]);
        }

    });

    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(string);


});


module.exports = router;