"use strict";

var db = require('./database.js')
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

module.exports = {
    passport: passport,
    hashPassword: hashPassword,
    checkPassword: checkPassword,
    createUser: createUser
}

passport.serializeUser(function(user, done) {
        done(null, user.name);
    });

passport.deserializeUser(function (username, done) {
    return db.getUser(username, function (user) {
        return done(null, user);
    }, function () {
        return done("Err?", null);
    });
});

passport.use('local', new LocalStrategy(
    { passReqToCallback: true }, function (req, username, password, done) {
        return db.getUser(username, function (user) {
            checkPassword(password, user, function (res) {
                if (!res) {
                    return done(null, false, { message: 'Incorrect Username/Password' })
                } else {
                    return done(null, user);
                }
            });
        }, function () {
            return done(null, false, { message: 'User not found' });
        });
    }
));

passport.use('register', new LocalStrategy(
    { passReqToCallback: true }, function (req, username, password, done) {
        if(password.length < 4) {
            return done(null, false, { message: 'Too short' });
        }
        return createUser(username, password, function(err, res) {
            if(!err) {
                return done(null, res["rows"][0]);
            } else {
                console.log("Error called");
                console.log(err);
                return done(null, false, { message: 'An error occured' });
            }
        });
    }
));

function hashPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(!err) {
                callback(hash);
            }
        });
    });
}

function checkPassword(password, user, callback) {
    bcrypt.compare(password, user.password, function(err, res) {
        if(!err) {
            callback(res);
        }
    });
}

//TODO: Probably refactor this
function createUser(username, password, callback) {
    hashPassword(password, function(hash) {
        db.createUser(username, hash, callback);
    });
}