process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('./app.js');
const items = require('./fakeDb.js');

const item1 = { name: 'pencil', price: '3' };
const item2 = { name: 'pen', price: '4' };
const badItem = { nam: 'oops', pric: '7' };

beforeEach(() => items.push(item1, item2));

afterEach(() => items.length = 0);

describe("GET /items", function () {
    test("Gets a list of items", async function () {
        const resp = await request(app).get(`/items`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([item1, item2]);
    });
});

describe("GET /items/:name", function () {
    test("Gets item by name", async function () {
        const resp = await request(app).get(`/items/${item1.name}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(item1);
    });

    test("Returns error when requesting nonexistent item", async function () {
        const resp = await request(app).get(`/items/${badItem.nam}`);

        expect(resp.statusCode).toBe(406);
        expect(resp.body).toEqual({ error: { status_code: 406, message: 'name not found' } });
    });
});

describe("POST /items", function () {
    test("Adds an item", async function () {
        const resp = await request(app).post(`/items`).send(item1);

        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual(item1);
    });

    test("Returns error when adding bad item", async function () {
        const resp = await request(app).post(`/items`).send(badItem);

        expect(resp.statusCode).toBe(422);
    });
});

describe("PATCH /items/:name", function () {
    test("Updates an item", async function () {
        const resp = await request(app).patch(`/items/${item1.name}`).send(item2);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ updated: item2 });
    });

    test("Returns error when updating to bad item", async function () {
        const resp = await request(app).patch(`/items/${item2.name}`).send(badItem);

        expect(resp.statusCode).toBe(406);
    });
});

describe("DELETE /items/:name", function () {
    test("Deletes an item", async function () {
        const resp = await request(app).delete(`/items/${item1.name}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: 'deleted' });
    });

    test("Returns error when deleting nonexistent item", async function () {
        const resp = await request(app).delete(`/items/${badItem.nam}`);

        expect(resp.statusCode).toBe(406);
        expect(resp.body).toEqual({ error: { status_code: 406, message: 'name not found' } });
    });
});
