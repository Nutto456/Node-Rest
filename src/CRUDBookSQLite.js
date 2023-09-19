require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

const db = new sqlite3.Database('./Database/Book.sqlite');

app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS Book (
    id INTEGER PRIMARY KEY, 
    title TEXT,
    author TEXT
)`);

app.get('/books', (req, res) => {
    db.all('SELECT * FROM Book', (err, row) => {
        if (err) {
            res.Status(500).send(err);
        } else {
            res.json(row);
        }
    });
});

app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM Book WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book Not Found');
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/books', (req, res) => {
    const book = req.body;
    db.run(`INSERT INTO Book (title, author) VALUES (?, ?)`, book.title, book.author, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            res.send(book);
        }
    });
});

app.put('/books/:id', (req, res) => {
    const book = req.body;
    db.run(`UPDATE Book SET title = ?, author = ? WHERE id = ?`, book.title, book.author, req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });
});

app.delete('/books/:id', (req, res) => {
    db.run(`DELETE FROM Book WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else if (this.changes === 0) {
            res.status(404).send('Book Not Found');
        } 
        else {
            res.send('Book is deleted');
        }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));