/**
 * Created by Fabio on 29/03/2017.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

//var User = require('../models/user.model');
var dblite = require('dblite');
db = dblite('/opt/plantinoServer/plantino_record.db');

//var db = new sqlite3.Database('/opt/plantinoServer/plantino_record.db');
router.get('/', function (req, res, next) {
    res.render('home');
});

module.exports = router;