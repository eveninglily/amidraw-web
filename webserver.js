var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var fs = require('fs');
var db = require('./models/database.js');

//TODO: Replace if open source/opening API
var API_KEY = "7fd895d5-b1a8-441f-b4f1-1cc7995a8218";

app.set('view engine', 'pug');

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('signup', function(req, res) {
    res.send("Sign up");
}).get('login', function(req, res) {
    res.send("Log in");
}).get('/gallery', function(req, res) {
    db.getAllGalleryEntries(function(data) {
        res.render('gallery', { gallery_items: data });
    });
}).post('/api/gallery/create', function(req, res) {
    console.log(req.body);
    var key = req.body.apikey;
    console.log(key);
    if(key != API_KEY) {
        res.send('Invalid API Key\n');
        return;
    }

    var title = req.body.title;
    var desc = req.body.description;
    var path = req.body.path;
    var user = req.body.user;
    db.addGalleryEntry(title, desc, path, user);
    res.sendStatus(200);
}).get('/gallery/:id', function(req, res) {
    db.getGalleryEntry(req.params.id, function(data) {
        var imgData = data["rows"][0];
        res.render('galleryEntry', {title: imgData.title, data: imgData})
    }, function() {
        res.sendStatus(404);
    });
});

router.use('/', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router);

app.listen(8080, function() {
    console.log("Running!");
});