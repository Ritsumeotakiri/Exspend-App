const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./expense_tracker.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS USERS (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      USERNAME TEXT UNIQUE,
      EMAIL TEXT UNIQUE,
      HASHED_PASS TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS EXPENSE (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      USER_ID INTEGER,
      AMOUNT REAL,
      CATEGORY TEXT,
      DATE TEXT,
      NOTES TEXT,
      FOREIGN KEY(USER_ID) REFERENCES USERS(ID)
    )
  `);
});

module.exports = db;
