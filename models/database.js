var pg = require('pg');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json', 'UTF-8'));
var dbConfig = config.database;

var connection = 'pg://' + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.server + ":" + dbConfig.port + "/" + dbConfig.database;

var client = new pg.Client(connection);
client.connect();

//client.query("DROP TABLE gallery");
//client.query("CREATE TABLE IF NOT EXISTS gallery(id integer serial PRIMARY KEY, title varchar(64))");
//client.query("INSERT INTO gallery(id, title) values ($1, $2)", [1, 'Test']);
//client.query("INSERT INTO gallery(id, title) values ($1, $2)", [2, 'Test2']);
//client.query("INSERT INTO gallery(id, title) values ($1, $2)", [3, 'Test3']);

function getAllGalleryEntries(callback) {
    var query = client.query("SELECT * FROM gallery");
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
    var query = client.query("SELECT * FROM gallery WHERE id=$1 ", [id]);
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

module.exports = {
    'getGalleryEntry': getGalleryEntry,
    'getAllGalleryEntries': getAllGalleryEntries
}