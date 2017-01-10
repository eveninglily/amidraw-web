var pg = require('pg');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'UTF-8'));
var dbConfig = config.database;

var connection = 'pg://' + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.server + ":" + dbConfig.port + "/" + dbConfig.database;

var client = new pg.Client(connection);
client.connect();

//Uncomment when regenerating db
//var sql = fs.readFileSync('models/createdb.sql').toString();
//client.query(sql);

function getAllGalleryEntries(callback) {
    var query = client.query("SELECT gallery.id, \
                                     gallery.title, \
                                     gallery.description, \
                                     gallery.imgpath, \
                                     users.name as username \
                              FROM gallery, users \
                              WHERE gallery.userid = users.id \
                              ORDER BY gallery.id");
    query.on("row", function (row, result) {
        result.addRow(row);
    }).on("end", function(result) {
        callback(result.rows);
    });
}

function getGalleryEntry(id, callback, err) {
    if(isNaN(id)) {
        err();
        return;
    }
    var query = client.query("SELECT gallery.*, \
                                     users.name as username \
                              FROM gallery, users \
                              WHERE gallery.id=$1 AND (gallery.userid = users.id) ", [id]);
    query.on("row", function (row, result) {
        result.addRow(row);
    }).on("end", function(result) {
        if(result.length == 0 || result["rows"][0] == null) {
            err();
            return;
        }
        callback(result);
    });
}

function addGalleryEntry(title, description, path, userid) {
    client.query("INSERT INTO gallery(title, description, imgpath, userid) values ($1, $2, $3, $4);", [title, description, path, userid]);
}

function getUser(username, callback, err) {
    var query = client.query("SELECT * FROM users WHERE LOWER(users.name)=LOWER($1);", [username]);
    query.on("row", function (row, result) {
        result.addRow(row);
    }).on("end", function(result) {
        if(result.length == 0 || result["rows"][0] == null) {
            err();
            return;
        }
        callback(result ["rows"][0]);
    });
}

function createUser(username, password, callback) {
    client.query("INSERT INTO users(name, password) values ($1, $2) RETURNING *;", [username, password], callback);
}

module.exports = {
    'getGalleryEntry': getGalleryEntry,
    'getAllGalleryEntries': getAllGalleryEntries,
    'addGalleryEntry': addGalleryEntry,
    'getUser': getUser,
    'createUser': createUser
}