var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var db = require('./models/database.js');

app.set('view engine', 'pug');

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/gallery', function(req, res) {
    db.getAllGalleryEntries(function(data) {
        res.render('gallery', {title: 'AmiDraw Gallery', gallery_items: data});
    });
}).get('/gallery/:id', function(req, res) {
    db.getGalleryEntry(req.params.id, function(data) {
        var imgData = data["rows"][0];
        res.render('galleryEntry', {title: imgData.title, data: imgData})
    }, function() {
        res.sendStatus(404);
    });
});
router.use('/', express.static('public'));
app.use('/', router);

app.listen(8080, function() {
    console.log("Running!");
});