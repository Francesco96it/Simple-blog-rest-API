var express = require('express');
var router = express.Router();
var connection = require('../database');

// Definisci la route per recuperare i posts dal database con paginazione e parametri opzionali
router.get('/get-posts', function (req, res, next) {

    var perPage = parseInt(req.query.perPage) || 10;

    var page = parseInt(req.query.page) || 1;

    var offset = (page - 1) * perPage;

    var query = 'SELECT * FROM posts';

    if (perPage) {
        query += ' LIMIT ? OFFSET ?';
    }

    connection.query(query, [perPage, offset], function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }

        res.json(results);
    });
});



// Route per creare un nuovo post
router.post('/create-post', function (req, res, next) {
    var post = req.body;
 
    connection.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }

        res.json(results);
    });
});

// Route per modificare un post esistente
router.put('/update-post/:postId', function (req, res, next) {
    var postId = req.params.postId;
    var updatedPost = req.body;

    connection.query('UPDATE posts SET ? WHERE id = ?', [updatedPost, postId], function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }

        res.json(results);
    });
});

// Route per filtrare i post in base alla categoria e/o a un range di date
router.get('/filter-posts', function (req, res, next) {

    var categoryId = req.query.categoryId;
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;


    var query = 'SELECT * FROM posts WHERE 1=1';
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

    connection.query(query, queryParams, function (error, results, fields) {
        if (error) {
            console.error('Errore nella query SQL:', error);
            res.status(500).json({ error: 'Errore nella query SQL' });
            return;
        }

        res.json(results);
    });
});


module.exports = router;