process.env.NODE_ENV = `test`;

const request = require(`supertest`);
const app = require(`../app`);
const db = require(`../db`);

let testCompany;
const anotherTestCompany = {
  code: `tsla`,
  name: `tesla`,
  description: `a car company`,
};
const otherTestCompany = {
  code: `toy`,
  name: `toyota`,
  description: `a real car company`,
};

beforeEach(async function () {
  const result = await db.query(
    `
    INSERT INTO companies VALUES ($1, $2, $3) 
    RETURNING code, name, description;`,
    [`fos`, `flowofasun`, `a fake company`]
  );
  testCompany = result.rows[0];
});

afterEach(async function () {
  await db.query(`
    DELETE FROM companies;`);
});

afterAll(async function () {
  await db.end();
});

describe(`GET /companies`, function () {
  test(`Gets a list of companies`, async function () {
    const resp = await request(app).get(`/companies`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ companies: [testCompany] });
  });
});

//fails because industries
describe(`GET /companies/:code`, function () {
  test(`Gets company by code`, async function () {
    const resp = await request(app).get(`/companies/${testCompany.code}`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ company: testCompany });
  });
  test(`Returns 404 error when requesting nonexistent company by code`, async function () {
    const resp = await request(app).get(`/companies/doesnotexist`);

    expect(resp.statusCode).toBe(404);
    expect(resp.body).toEqual({
      error: { message: `Company not found`, status: 404 },
    });
  });
});

describe(`POST /companies`, function () {
  test(`Adds a company`, async function () {
    const resp = await request(app).post(`/companies`).send({
      name: anotherTestCompany.name,
      description: anotherTestCompany.description,
    });

    expect(resp.statusCode).toBe(201);
    expect(resp.body.company.description).toEqual(
      anotherTestCompany.description
    );
  });

  test(`Returns 422 error when posting company with insufficient data`, async function () {
    const resp = await request(app).post(`/companies`).send({ code: `blah` });

    expect(resp.statusCode).toBe(422);
    expect(resp.body).toEqual({
      error: { message: `Missing data`, status: 422 },
    });
  });
});

describe(`PUT /companies/:code`, function () {
  test(`Edits a company`, async function () {
    const resp = await request(app).put(`/companies/${testCompany.code}`).send({
      name: anotherTestCompany.name,
      description: anotherTestCompany.description,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      company: {
        code: testCompany.code,
        name: anotherTestCompany.name,
        description: anotherTestCompany.description,
      },
    });
  });

  test(`Returns 422 error when editing company with insufficient data`, async function () {
    const resp = await request(app)
      .put(`/companies/${testCompany.code}`)
      .send({ code: `blah` });

    expect(resp.statusCode).toBe(422);
    expect(resp.body).toEqual({
      error: { message: `Missing data`, status: 422 },
    });
  });

  test(`Returns 404 error when editing company with non-existent code`, async function () {
    const resp = await request(app)
      .put(`/companies/${anotherTestCompany.code}`)
      .send({
        name: otherTestCompany.name,
        description: otherTestCompany.description,
      });

    expect(resp.statusCode).toBe(404);
    expect(resp.body).toEqual({
      error: { message: `Company not found`, status: 404 },
    });
  });
});

describe(`DELETE /companies/:code`, function () {
  test(`Deletes a company`, async function () {
    const resp = await request(app).delete(`/companies/${testCompany.code}`);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ status: `deleted` });
  });

  test(`Returns 404 error when deleting company with non-existent code`, async function () {
    const resp = await request(app).delete(
      `/companies/${anotherTestCompany.code}`
    );

    expect(resp.statusCode).toBe(404);
  });
});
