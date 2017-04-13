/**
 * Created by Fabio on 29/03/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var user = require('./../models/user.model.js');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    var userName = user.name;
    var token = user.token;
    console.log("prova", token);

    if (req.session && req.session.email === token && req.session.admin){
        res.redirect('/home', {user: JSON.stringify(userName)} );
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

router.post('/home', function (req, res){
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


module.exports = router;