'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../database'); 


passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        connection.query(query, [username], (error, results, fields) => {
            if (error) {
                return done(error);
            }
            if (results.length === 0) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            const user = results[0];
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            return done(null, user);
        });
    } catch (error) {
        return done(error);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        connection.query(query, [id], (error, results, fields) => {
            if (error) {
                return done(error);
            }
            const user = results[0];
            done(null, user);
        });
    } catch (error) {
        return done(error);
    }
});


router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(query, [username, password], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        const newUser = { id: results.insertId, username, password };
        res.json(newUser);
    });
});


router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;