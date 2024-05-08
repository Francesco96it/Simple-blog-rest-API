var express = require('express');
var router = express.Router();
var connection = require('../database');

// Definisci la route per recuperare i "posts" dal database con paginazione e parametri opzionali
router.get('/get-posts', function (req, res, next) {
    // Imposta il numero di elementi per pagina
    var perPage = parseInt(req.query.perPage) || 10;
    // Imposta il numero di pagina
    var page = parseInt(req.query.page) || 1;

    // Calcola l'offset sulla base del numero di pagina
    var offset = (page - 1) * perPage;

    // Costruisci la query SQL per recuperare i "posts" con paginazione
    var query = 'SELECT * FROM posts';

    // Se il parametro perPage è presente, aggiungi LIMIT e OFFSET alla query
    if (perPage) {
        query += ' LIMIT ? OFFSET ?';
    }

    // Esegui la query per recuperare i "posts" dal database con paginazione
    connection.query(query, [perPage, offset], function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia i "posts" come risposta JSON
        res.json(results);
    });
});



// Route per creare un nuovo post
router.post('/create-post', function (req, res, next) {
    var post = req.body;
    // Esegui la query per inserire il nuovo post nel database
    connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia il risultato della query come risposta JSON
        res.json(results);
    });
});

// Route per modificare un post esistente
router.put('/update-post/:postId', function (req, res, next) {
    var postId = req.params.postId;
    var updatedPost = req.body;
    // Esegui la query per aggiornare il post nel database
    connection.query('UPDATE posts SET ? WHERE id = ?', [updatedPost, postId], function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia il risultato della query come risposta JSON
        res.json(results);
    });
});

// Route per filtrare i post in base alla categoria e/o a un range di date
router.get('/filter-posts', function (req, res, next) {
    // Estrai i parametri dalla query della richiesta
    var categoryId = req.query.categoryId;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;

    // Costruisci la query SQL in base ai parametri forniti
    var query = 'SELECT * FROM posts WHERE 1=1'; // Utilizziamo 1=1 come condizione di partenza per evitare di dover gestire la presenza o meno di condizioni
    var queryParams = [];

    if (categoryId) {
        query += ' AND category_id = ?';
        queryParams.push(categoryId);
    }
    if (startDate) {
        query += ' AND date_time >= ?';
        queryParams.push(startDate);
    }
    if (endDate) {
        query += ' AND date_time <= ?';
        queryParams.push(endDate);
    }

    // Esegui la query per filtrare i post in base ai parametri forniti
    connection.query(query, queryParams, function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia i risultati della query come risposta JSON
        res.json(results);
    });
});


module.exports = router;