
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PWD,
    database : process.env.DB_NAME
});

connection.connect();

let createQuery = "CREATE TABLE IF NOT EXISTS `users` (\n" +
    "  `id` int(11) NOT NULL AUTO_INCREMENT,\n" +
    "  `user_name` varchar(255) NOT NULL,\n" +
    "  `password` varchar(255) NOT NULL,\n" +
    "  `user_id` varchar(255) NOT NULL,\n" +
    "  `access_token` varchar(255) NOT NULL,\n" +
    "  `client_token` varchar(255) NOT NULL,\n" +
    "  PRIMARY KEY (`id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;";

connection.query(createQuery, function(err, rows, fields) {
    if (err) throw err;
});

exports.connection = connection;