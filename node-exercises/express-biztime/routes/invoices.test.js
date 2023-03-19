process.env.NODE_ENV = `test`;

const request = require(`supertest`);
const app = require(`../app`);
const db = require(`../db`);

let testInvoice;
let testCompany;

beforeEach(async function () {
  const companyResults = await db.query(
    `
    INSERT INTO 
    companies 
    (code, name, description) 
    VALUES 
    ($1, $2, $3) 
    RETURNING code, name, description;`,
    [`ibm`, `IBM`, `Big Blue`]
  );
  testCompany = companyResults.rows[0];
  const invoiceResults = await db.query(
    `
    INSERT INTO invoices 
    (comp_code, amt) 
    VALUES 
    ($1, $2) 
    RETURNING id, comp_code, amt, paid;`,
    [`ibm`, `100`]
  );
  testInvoice = invoiceResults.rows[0];
});

afterEach(async function () {
  await db.query(`DELETE FROM invoices;`);
  await db.query(`DELETE FROM companies;`);
});

afterAll(async function () {
  await db.end();
});

describe(`GET /invoices`, function () {
  test(`Gets a list of invoices`, async function () {
    const resp = await request(app).get(`/invoices`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      invoices: [{ id: testInvoice.id, comp_code: testInvoice.comp_code }],
    });
  });
});

describe(`GET /invoices/:id`, function () {
  test(`Gets existing invoice by id`, async function () {
    const resp = await request(app).get(`/invoices/${testInvoice.id}`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body.invoice.company.code).toBe(`ibm`);
    expect(resp.body.invoice.id).toBe(testInvoice.id);
  });

  test(`Error when requesting non-existing invoice`, async function () {
    const resp = await request(app).get(`/invoices/2`);

    expect(resp.statusCode).toBe(404);
    expect(resp.body.error.message).toBe(`Invoice not found`);
  });
});

describe(`POST /invoices`, function () {
  test(`Create new invoice for existing company`, async function () {
    const newInvoice = { comp_code: `ibm`, amt: 20 };
    const resp = await request(app).post(`/invoices`).send(newInvoice);

    expect(resp.statusCode).toBe(201);
    expect(resp.body.invoice.amt).toBe(20);
    expect(resp.body.invoice.comp_code).toEqual(`ibm`);
  });

  test(`Error when creating invoice with insufficient data`, async function () {
    const newInvoice = {};
    const resp = await request(app).post(`/invoices`).send(newInvoice);

    expect(resp.statusCode).toBe(422);
    expect(resp.body.error).toEqual({ message: `Missing data`, status: 422 });
  });
});

describe(`PUT /invoices/:id`, function () {
  test(`Pay existing invoice`, async function () {
    const resp = await request(app)
      .put(`/invoices/${testInvoice.id}`)
      .send({ amt: 50, paid: true });

    expect(resp.statusCode).toBe(200);
    expect(resp.body.invoice.amt).toBe(50);
    expect(resp.body.invoice.paid).toBe(true);
    expect(resp.body.paid_date).not.toBe(null);
  });

  test(`Error when updating non-existent invoice`, async function () {
    const resp = await request(app).put(`/invoices/5`).send({ amt: 100 });

    expect(resp.statusCode).toBe(404);
    expect(resp.body.error.message).toEqual(`Invoice not found`);
  });

  test(`Error when updating existing invoice with no data`, async function () {
    const resp = await request(app).put(`/invoices/${testInvoice.id}`).send({});

    expect(resp.statusCode).toBe(422);
    expect(resp.body.error.message).toEqual(`Missing Amount(req.data.amt)`);
  });
});

describe(`DELETE /invoices/:id`, function () {
  test(`Delete existing invoice`, async function () {
    const resp = await request(app).delete(`/invoices/${testInvoice.id}`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body.status).toEqual(`deleted`);
  });

  test(`Error when deleting non-existent invoice`, async function () {
    const resp = await request(app).delete(`/invoices/5`);

    expect(resp.statusCode).toBe(404);
    expect(resp.body.error.message).toEqual(`Invoice not found`);
  });
});
