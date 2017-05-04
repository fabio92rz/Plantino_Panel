/**
 * Created by Fabio on 29/03/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var user = require('./../models/user.model.js');
var plantSpec = require('./../models/plant.model');
var path = require('path');
var fs = require('fs');


//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

router.get('/', function (req, res, next) {
    var userName = user.name;
    var token = user.token;
    console.log("prova", token);

    var plantData = {

        plantTemp : String,
        plantMoist : String,
        plantLight : String
    };

    db.query("SELECT * FROM temperatures ORDER BY id DESC ", ['id', 'temperature'], function (err, rows) {

        var jsonTemp = JSON.stringify(rows.length && rows[0]);
        var tempSpec = JSON.parse(jsonTemp);

        db.query("SELECT * FROM humiditys ORDER BY id DESC ", ['id', 'moist'], function (err, rows) {

            var jsonMoist = JSON.stringify(rows.length && rows[0]);
            var moistSpec = JSON.parse(jsonMoist);

            db.query("SELECT * FROM sunlights ORDER BY id DESC ", ['id', 'light'], function (err, rows) {

                var jsonLight = JSON.stringify(rows.length && rows[0]);
                var lightSpec = JSON.parse(jsonLight);

                plantData.plantTemp = tempSpec.temperature;
                plantData.plantMoist = moistSpec.moist;
                plantData.plantLight = lightSpec.light;

                console.log(JSON.stringify(plantSpec));

                if (req.session && req.session.email === token && req.session.admin){
                    res.render('home', {user: JSON.stringify(userName), userPlant: JSON.stringify(plantSpec), plantSpec: JSON.stringify(plantData)});
                }else {
                    res.redirect('/');
                }
            });

        });
    });
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

    plantSpec.name= selectedPlant;
    plantSpec.minTemp = minTemp;
    plantSpec.maxTemp = maxTemp;
    plantSpec.minHum = minHum;
    plantSpec.maxHum = maxHum;
    plantSpec.minLight = minLight;
    plantSpec.maxLight = maxLight;


    console.log(req.body);

    var string = "success";

    db.query("SELECT * FROM selectedPlant where id = '?' ", [1], function (err, rows) {

        var registeredPlant = JSON.stringify(rows.length && rows[0]);
        var plantContent = JSON.parse(registeredPlant);

        console.log(registeredPlant);
        console.log(plantContent);

        if (plantContent != null){

            db.query("UPDATE selectedPlant SET plantName = ?, minTemp = ?, maxTemp = ?, minHum = ?, maxHum = ?, minLight = ?, maxLight = ? WHERE id = ?", [selectedPlant, minTemp, maxTemp, minHum, maxHum, minLight, maxLight, 1]);

        }else {

            db.query("INSERT INTO selectedPlant (plantName, minTemp, maxTemp, minHum, maxHum, minLight, maxLight) VALUES (?, ?, ?, ?, ?, ?, ?)", [selectedPlant, minTemp, maxTemp, minHum, maxHum, minLight, maxLight]);
        }

    });

    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(string);


});


module.exports = router;