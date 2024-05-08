var express = require('express');
var router = express.Router();
var connection = require('../database');

// Definisci la route per recuperare le categorie
router.get('/get-categories', function (req, res, next) {
    // Esegui la query per recuperare le categorie dal database
    connection.query('SELECT * FROM categories', function (error, results) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia il risultato della query come risposta JSON
        res.json(results);
    });
});

// Route per creare una nuova categoria
router.post('/create-category', function (req, res, next) {
    var category = req.body;
    // Esegui la query per inserire la nuova categoria nel database
    connection.query('INSERT INTO categories SET ?', category, function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia il risultato della query come risposta JSON
        res.json(results);
    });
});

// Route per modificare una categoria esistente
router.put('/update-category/:categoryId', function (req, res, next) {
    var categoryId = req.params.categoryId;
    var updatedCategory = req.body;
    // Esegui la query per aggiornare la categoria nel database
    connection.query('UPDATE categories SET ? WHERE id = ?', [updatedCategory, categoryId], function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        // Invia il risultato della query come risposta JSON
        res.json(results);
    });
});

module.exports = router;