var LocalStrategy = require('passport-local').Strategy
var db = require('./database.js');
var bcrypt = require('bcrypt');

module.exports = {
    //TODO: Fix this
    localAuth: function(db) {
        return new LocalStrategy({passReqToCallback : true }, function(req, username, password, done) {
            console.log(db);
            return db.getUser(username, function(data) {
                var entry = data["rows"][0];
                checkPassword(password, entry, function(res) {
                    if(!res) {
                        return done(null, false, { message: 'Incorrect Username/Password'})
                    } else {
                        return done(null, entry);
                    }
                });
            }, function() {
                return done(null, false, { message: 'User not found' });
            });
        });
    },
    serializeUser: serializeUser,
    deserializeUser: deserializeUser,
    hashPassword: hashPassword,
    checkPassword: checkPassword,
    db: db
}

function serializeUser(user, done) {
    done(null, user.name);
}

//TODO: Fix this
function deserializeUser(db) {
    return function(username, done) {
        return db.getUser(username, function(data) {
            var entry = data["rows"][0];
            return done(null, entry);
        }, function() {
            return done("Err?", null);
        });
    }
};

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