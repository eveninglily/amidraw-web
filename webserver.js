var express = require('express');
var session = require('express-session');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var fs = require('fs');
var db = require('./models/database.js');

var passport = require('passport');
var auth = require('./models/auth.js');

passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser(db));
passport.use('local', auth.localAuth(db));

//TODO: Replace if open source/opening API
var API_KEY = "7fd895d5-b1a8-441f-b4f1-1cc7995a8218";

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

router.get('/signup', function(req, res) {
    res.send("Sign up");
}).post('/signup', function(req, res) {

}).get('/login', function(req, res) {
    res.render('login');
}).post('/login', passport.authenticate('local', {
    successRedirect: '/auth',
    failureRedirect: '/login'
})).get('/auth', isLoggedIn, function(req, res) {
    console.log(req.user);
    res.send("Logged in as " + req.user.name);
}).get('/gallery', function(req, res) {
    db.getAllGalleryEntries(function(data) {
        res.render('gallery', { gallery_items: data });
    });
}).get('/api/gallery/:id', function(req, res) {
    db.getGalleryEntry(req.params.id, function(data) {
        var entry = data["rows"][0];
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(entry));
    }, function() {
        res.sendStatus(404);
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
app.use(session({ secret: 'tempsecret', resave: false, saveUninitialized: false }));
app.set('view engine', 'pug');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router);

app.listen(8080, function() {
    console.log("Running!");
});