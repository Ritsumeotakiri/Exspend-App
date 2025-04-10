const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 Protected test route
router.get('/protected', authenticateToken, (req, res) => {
  console.log('Protected route hit by user:', req.user.userId);
  res.json({ message: 'You accessed a protected route!', userId: req.user.userId });
});

// 🧾 Add new expense
router.post('/', authenticateToken, (req, res) => {
  const { amount, category, date, notes } = req.body;
  const userId = req.user.userId;

  console.log('📥 Add expense request:', { userId, amount, category, date, notes });

  db.run(
    `INSERT INTO EXPENSE (USER_ID, AMOUNT, CATEGORY, DATE, NOTES)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, amount, category, date, notes],
    function (err) {
      if (err) {
        console.error('❌ Error adding expense:', err.message);
        return res.status(500).json({ error: 'Failed to add expense' });
      }

      console.log('✅ Expense added with ID:', this.lastID);
      res.status(201).json({ message: 'Expense added', expenseId: this.lastID });
    }
  );
});

// 📅 Get all expenses for logged-in user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  console.log('📡 Fetching expenses for user:', userId);

  db.all(`SELECT * FROM EXPENSE WHERE USER_ID = ?`, [userId], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching expenses:', err.message);
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }

    console.log(`📤 Found ${rows.length} expense(s):`);
    console.log(rows);

    res.json(rows);
  });
});

// 🗑️ Delete expense by ID
router.delete('/:id', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  console.log('🗑️ Deleting expense:', expenseId, 'for user:', userId);

  db.run(
    `DELETE FROM EXPENSE WHERE ID = ? AND USER_ID = ?`,
    [expenseId, userId],
    function (err) {
      if (err) {
        console.error('❌ DB delete error:', err.message);
        return res.status(500).json({ error: 'Delete failed' });
      }

      if (this.changes === 0) {
        console.warn('⚠️ Nothing deleted — not found or unauthorized');
        return res.status(404).json({ error: 'Expense not found or not yours' });
      }

      console.log('✅ Expense deleted successfully');
      res.json({ message: 'Deleted successfully' });
    }
  );
});

module.exports = router;
