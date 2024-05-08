var mysql = require('mysql');

// Configura la connessione al database MySQL
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'equuan',
    password: 'admin1234',
    database: 'blog'
});

// Connessione al database
connection.connect(function (err) {
    if (err) {
        console.error('Errore di connessione al database:', err);
        return;
    }
    console.log('Connessione al database MySQL avvenuta con successo');
});

module.exports = connection;