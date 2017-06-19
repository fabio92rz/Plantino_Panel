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
var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './../plantImages/');

    },
    filename: function (req, file, callback) {
        callback(null, file + '-' + Date.now())
    }
});

var upload = multer({ storage: storage}).single('plantPhoto');

router.get('/getImage', function (req, res) {
    res.sendfile(__dirname + "home.jade");

});

router.post('/postImage', function (req, res) {
    upload(req, res, function (err) {
        console.log(req.body);
        if (err){
            return res.end("Error uploading File.");
        }
        res.end("File is uploaded");
    });
});

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

router.get('/', function (req, res, next) {
    var userName = user.name;
    var token = user.token;
    console.log("prova", token);

    var plantData = {

        plantTemp: String,
        plantMoist: String,
        plantLight: String,
        moistTime: String,
        lightTime: String
    };

    var tempTimeGraph = [];
    var tempGraph = [];
    var moistTimeGraph = [];
    var moistGraph = [];
    var lightTimeGraph = [];
    var lightGraph = [];

    db.query("SELECT * FROM temperatures ORDER BY id DESC ", ['id', 'temperature', 'inserted_at'], function (err, rows) {

        var jsonTemp = JSON.stringify(rows.length && rows[0]);
        var tempSpec = JSON.parse(jsonTemp);

        for (var i = rows.length-1; i >= 0; i--) {

            tempGraph.push(rows[i].temperature/100);
            tempTimeGraph.push(rows[i].inserted_at);
        }


        db.query("SELECT * FROM humiditys ORDER BY id DESC ", ['id', 'moist', 'inserted_at'], function (err, rows) {

            var jsonMoist = JSON.stringify(rows.length && rows[0]);
            var moistSpec = JSON.parse(jsonMoist);

            for (var j = rows.length-1; j >= 0; j--){

                moistGraph.push(rows[j].moist/100);
                moistTimeGraph.push(rows[j].inserted_at);
            }

            db.query("SELECT * FROM sunlights ORDER BY id DESC ", ['id', 'light', 'inserted_at'], function (err, rows) {

                var jsonLight = JSON.stringify(rows.length && rows[0]);
                var lightSpec = JSON.parse(jsonLight);

                for (var k = rows.length-1; k >= 0; k--){

                    lightGraph.push(rows[k].light);
                    lightTimeGraph.push(rows[k].inserted_at);
                }

                plantData.plantTemp = tempSpec.temperature;
                plantData.plantMoist = moistSpec.moist;
                plantData.moistTime = moistSpec.inserted_at;
                plantData.plantLight = lightSpec.light;
                plantData.lightTime = lightSpec.inserted_at;

                console.log(JSON.stringify(tempGraph));

                if (req.session && req.session.email === token && req.session.admin) {
                    res.render('home', {
                        user: JSON.stringify(userName),
                        userPlant: JSON.stringify(plantSpec),
                        plantData: JSON.stringify(plantData),
                        tempGraph: JSON.stringify(tempGraph),
                        tempTimeGraph: JSON.stringify(tempTimeGraph),
                        moistGraph: JSON.stringify(moistGraph),
                        moistTimeGraph: JSON.stringify(moistTimeGraph),
                        lightGraph: JSON.stringify(lightGraph),
                        lightTimeGraph: JSON.stringify(lightTimeGraph)
                    });
                } else {
                    res.render('/');
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

router.post('/getPlant', function (req, res) {

    var jsonPlant = req.body;
    var selectedPlant = jsonPlant.plant;
    var minTemp = jsonPlant.minTemp;
    var maxTemp = jsonPlant.maxTemp;
    var minHum = jsonPlant.minHum;
    var maxHum = jsonPlant.maxHum;
    var minLight = jsonPlant.minLight;
    var maxLight = jsonPlant.maxLight;

    plantSpec.name = selectedPlant;
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

        if (plantContent != null) {

            db.query("UPDATE selectedPlant SET plantName = ?, minTemp = ?, maxTemp = ?, minHum = ?, maxHum = ?, minLight = ?, maxLight = ? WHERE id = ?", [selectedPlant, minTemp, maxTemp, minHum, maxHum, minLight, maxLight, 1]);

        } else {

            db.query("INSERT INTO selectedPlant (plantName, minTemp, maxTemp, minHum, maxHum, minLight, maxLight) VALUES (?, ?, ?, ?, ?, ?, ?)", [selectedPlant, minTemp, maxTemp, minHum, maxHum, minLight, maxLight]);
        }

    });

    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(string);


});


module.exports = router;