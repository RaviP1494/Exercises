const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

const createBookData = {
  isbn: "12345678910",
  amazon_url: "http://a.co/fakeid",
  author: "Isaac Asimov",
  language: "russian",
  pages: 90,
  publisher: "penguin",
  title: "foundation",
  year: 1968,
};

let bookA;

describe("Books Routes Tests", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books;");
    const result = await db.query(
      `INSERT INTO books(
            isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING 
                isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year`,
      [
        "0691161518",
        "http://a.co/eobPtX2",
        "Matthew Lane",
        "english",
        264,
        "Princeton University Press",
        "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        2017,
      ]
    );
    bookA = result.rows[0];
  });

  describe("GET /books", function () {
    test("Getting all books", async function () {
      let response = await request(app).get("/books");

      expect(response.body.books[0]).toEqual(bookA);
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /books/:isbn", function () {
    test("Getting one book", async function () {
      let response = await request(app).get(`/books/${bookA.isbn}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.book).toEqual(bookA);
    });
  });

  describe("POST /books", function () {
    test("Creating a new book successfully", async function () {
      const isbn = createBookData.isbn;

      let createResponse = await request(app)
        .post("/books")
        .send(createBookData);

      let checkIfAddedResponse = await request(app).get(`/books/${isbn}`);

      createResponse.body.isbn = isbn;

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body.book).toEqual(createBookData);
      expect(checkIfAddedResponse.body.book).toEqual(createBookData);
    });

    test("Creating a new book with missing property", async function () {
      const badBookData = { ...createBookData };
      delete badBookData.author;

      let response = await request(app).post("/books").send(badBookData);

      expect(response.statusCode).toBe(400);
      expect(response.body.ValidationErrors).toBeTruthy();
    });
  });

  describe("PUT /books/:isbn", function () {
    test("Updating existing book with all properties specified successfully", async function () {
      const diffBookData = { ...createBookData };
      const isbn = bookA.isbn;
      delete diffBookData.isbn;

      let response = await request(app)
        .put(`/books/${isbn}`)
        .send(diffBookData);

      let checkIfChangedResponse = await request(app).get(`/books/${isbn}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.book).toEqual({ isbn, ...diffBookData });
      expect(checkIfChangedResponse.body.book).toEqual({
        isbn,
        ...diffBookData,
      });
    });

    test("Updating existing book's title successfully", async function () {
      const diffBookData = { title: "harry potter" };
      const isbn = bookA.isbn;

      let response = await request(app)
        .put(`/books/${isbn}`)
        .send(diffBookData);

      let checkIfChangedResponse = await request(app).get(`/books/${isbn}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.book.title).toEqual(diffBookData.title);
      expect(checkIfChangedResponse.body.book.title).toEqual(
        diffBookData.title
      );
    });

    test("Updating existing book's isbn successfully", async function () {
      const diffBookData = { isbn: "12312312311" };
      const isbn = bookA.isbn;

      let response = await request(app)
        .put(`/books/${isbn}`)
        .send(diffBookData);

      let checkIfChangedResponse = await request(app).get(
        `/books/${diffBookData.isbn}`
      );

      expect(response.statusCode).toBe(201);
      expect(response.body.book.isbn).toEqual(diffBookData.isbn);
      expect(checkIfChangedResponse.body.book.title).toEqual(bookA.title);
    });

    test("Updating a book with invalid property(future year)", async function () {
      const diffBookData = { year: 3005 };
      const isbn = bookA.isbn;

      let response = await request(app)
        .put(`/books/${isbn}`)
        .send(diffBookData);

      expect(response.statusCode).toBe(400);
      expect(response.body.ValidationErrors).toBeTruthy();
    });
  });

  describe("DELETE /books/:isbn", function () {
    test("Delete book successfully", async function () {
      let response = await request(app).delete(`/books/${bookA.isbn}`);
      let checkIfDeletedResponse = await request(app).get(
        `/books/${bookA.isbn}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual("Book deleted");
      expect(checkIfDeletedResponse.statusCode).toBe(404);
    });
  });
});

afterAll(async function () {
  await db.end();
});
