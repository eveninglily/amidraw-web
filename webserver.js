var express = require('express');
var app = express();
var fs = require('fs');

var json_data = JSON.parse(fs.readFileSync('gallery_items.json', 'utf8'));

var data = json_data["images"];

app.set('view engine', 'pug');

app.get('/gallery/', function(req, res) {
    res.render('gallery', {title: 'AmiDraw Gallery', gallery_items: data});
});

app.listen(8080, function() {
    console.log("Running!");
})