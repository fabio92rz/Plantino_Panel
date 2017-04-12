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
router.use(bodyParser({uploadDir:'./../plantImages'}));

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    var userName = user.name;
    var token = user.token;
    console.log("prova", token);

    if (token){
        res.render('home', {user: JSON.stringify(userName)} );
    }else {
        res.redirect('/');
    }
});

router.post('/', function (req, res, next) {
    user.token = "";
    user.name = "";
    console.log("prova user", user.token);
    res.render('index');

});

router.post('/upload', function (req, res){
    var tempPath = req.files.file.path,
        targetPath = path.resolve('./../plantImages/image.jpg');
    if (path.extname(req.files.file.name).toLowerCase() === '.jpg'){
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