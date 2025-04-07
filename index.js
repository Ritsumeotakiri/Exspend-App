const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // 👈 this parses JSON bodies

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
