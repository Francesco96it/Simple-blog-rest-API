var express = require('express');
var router = express.Router();
var connection = require('../database');

// Route per recuperare le categorie
router.get('/get-categories', function (req, res, next) {
    connection.query('SELECT * FROM categories', function (error, results) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
        res.json(results);
    });
});

// Route per creare una nuova categoria
router.post('/create-category', function (req, res, next) {
    var category = req.body;

    connection.query('INSERT INTO categories SET ?', category, function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }
  
        res.json(results);
    });
});

// Route per modificare una categoria esistente
router.put('/update-category/:categoryId', function (req, res, next) {
    var categoryId = req.params.categoryId;
    var updatedCategory = req.body;

    connection.query('UPDATE categories SET ? WHERE id = ?', [updatedCategory, categoryId], function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }

        res.json(results);
    });
});

module.exports = router;