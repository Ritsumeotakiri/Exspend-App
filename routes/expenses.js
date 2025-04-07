const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Add Expense (POST /api/expenses)
router.post('/', authenticateToken, (req, res) => {
  const { amount, category, date, notes } = req.body;
  const userId = req.user.userId;

  db.run(
    `INSERT INTO EXPENSE (USER_ID, AMOUNT, CATEGORY, DATE, NOTES)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, amount, category, date, notes],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add expense' });
      }
      res.status(201).json({ message: 'Expense added', expenseId: this.lastID });
    }
  );
});


// ✅ Get All Expenses for Logged-in User (GET /api/expenses)
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.all(`SELECT * FROM EXPENSE WHERE USER_ID = ?`, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }
    res.json(rows);
  });
});

module.exports = router;
