'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Simula un database di utenti
const users = [
    { id: 1, username: 'user', password: 'password' }
];

// Configura la strategia di autenticazione locale con Passport
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
    }
    return done(null, user);
}));

// Serializzazione e deserializzazione degli utenti
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Route per la registrazione di un nuovo utente
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Verifica se l'utente esiste già nel database 
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    // Aggiungi il nuovo utente al database
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.json(newUser);
});

// Route per il login
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

// Route per il logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;