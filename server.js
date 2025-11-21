import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

// Главная страница
app.get("/", (req, res) => {
  res.send("<h1>Library API працює!</h1><p>GET /books</p>");
});

// Получить все книги
app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Добавить книгу
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  db.run(
    "INSERT INTO books (title, author) VALUES (?, ?)",
    [title, author],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, author });
    }
  );
});

// Удалить книгу
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM books WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;

  db.run(
    "UPDATE books SET title = ?, author = ? WHERE id = ?",
    [title, author, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json({ id, title, author });
    }
  );
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM books WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (this.changes === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json({ message: "Book deleted", id });
    }
  );
});
