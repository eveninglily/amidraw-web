var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');

var json_data = JSON.parse(fs.readFileSync('gallery_items.json', 'utf8'));

var data = json_data["images"];

app.set('view engine', 'pug');

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/gallery', function(req, res) {
    console.log("Gallery request!");
    res.render('gallery', {title: 'AmiDraw Gallery', gallery_items: data});
});
router.use('/', express.static('public'));
app.use('/', router);

app.listen(8080, function() {
    console.log("Running!");
});