const express = require("express");
const jsonschema = require("jsonschema");
const Book = require("../models/book");

const newBookSchema = require("../schemas/newBookSchema.json");
const partialBookSchema = require("../schemas/partialBookSchema.json");

const router = new express.Router();

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  let book;
  const result = jsonschema.validate(req.body, newBookSchema);

  if (!result.valid) {
    const errorStack = result.errors.map((e) => {
      return { error: e.stack };
    });
    return res.status(400).json({ ValidationErrors: errorStack });
  }

  try {
    const bookData = result.instance;
    book = await Book.create(bookData);
  } catch (err) {
    return next(err);
  }
  return res.status(201).json({ book });
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  let book;
  const isbn = req.params.isbn;
  const result = jsonschema.validate({ isbn, ...req.body }, partialBookSchema);

  if (!result.valid) {
    const errorStack = result.errors.map((e) => {
      return { error: e.stack };
    });
    return res.status(400).json({ ValidationErrors: errorStack });
  }

  try {
    const bookData = req.body;
    book = await Book.update(isbn, bookData);
  } catch (err) {
    return next(err);
  }
  return res.status(201).json({ book });
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
