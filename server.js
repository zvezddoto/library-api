const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("./library.db");

// GET all books
app.get("/books", (req, res) => {
  const books = db.prepare("SELECT * FROM books").all();
  res.json(books);
});

// GET book by ID
app.get("/books/:id", (req, res) => {
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(req.params.id);
  if (!book) return res.status(404).json({ error: "Not found" });
  res.json(book);
});

// POST new book
app.post("/books", (req, res) => {
  const insert = db.prepare("INSERT INTO books (title, author) VALUES (?, ?)");
  const result = insert.run(req.body.title, req.body.author);
  res.json({ id: result.lastInsertRowid });
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const del = db.prepare("DELETE FROM books WHERE id = ?");
  del.run(req.params.id);
  res.json({ message: "Book deleted" });
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Server running on port " + port));
