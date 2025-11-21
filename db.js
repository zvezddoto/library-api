import sqlite3 from "sqlite3";
sqlite3.verbose();
const db = new sqlite3.Database("./library.db");
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL
    )`);
});
export default db;