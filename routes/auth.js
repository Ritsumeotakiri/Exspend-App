const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET_KEY = '_jwt_secret_key'; 

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
    db.get('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (row) return res.status(409).json({ error: 'Email already in use' });

    const hashedPass = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO USERS (USERNAME, EMAIL, HASHED_PASS) VALUES (?, ?, ?)',
      [username, email, hashedPass],
      function (err) {
        if (err) return res.status(500).json({ error: 'Insert failed' });

        // ✅ Generate token after signup
        const token = jwt.sign({ userId: this.lastID }, SECRET_KEY, { expiresIn: '1h' });

        return res.status(201).json({
          message: 'User registered',
          token,  
        });
      }
    );
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, user.HASHED_PASS);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.ID }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

module.exports = router;
