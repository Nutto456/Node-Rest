const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(
    'mongodb://admin:IDKxqf89775@node50115-env-7377511.proen.app.ruk-com.cloud:11552', 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
);

const Book = mongoose.model('Book', {
    id: Number,
    title: String,
    author: String
});

const app = express();

app.use(bodyParser.json());

app.post('/books',async (req, res) => {
    try {
        const book = new Book(req.body);
        book.id = (await Book.countDocuments()) + 1;
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ id: req.params.id });
        res.send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { 
            new: true });
        res.send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        res.send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port http://localhost:${port}`));