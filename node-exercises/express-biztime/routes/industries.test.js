process.env.NODE_ENV = `test`;

const request = require(`supertest`);
const app = require(`../app`);
const db = require(`../db`);

let testCompanyFree;
let testCompanyAttached; //associated with testIndustry
let testIndustry;
let testCompanyIndustry;
const testCreateIndustry = { code: `test code`, name: `test name` };

beforeEach(async function () {
  const companyFreeResults = await db.query(
    `
    INSERT INTO companies
    (code, name, description)
    VALUES
    ($1, $2, $3)
    RETURNING code, name, description;`,
    [`testcf`, `testCompanyFree`, `a company unattached to testIndustry`]
  );

  testCompanyFree = companyFreeResults.rows[0];

  const companyAttachedResults = await db.query(
    `
    INSERT INTO companies
    (code, name, description)
    VALUES
    ($1, $2, $3)
    RETURNING code, name, description;`,
    [`fos`, `flowofasun`, `a fake company`]
  );

  testCompanyAttached = companyAttachedResults.rows[0];

  const industryResults = await db.query(
    `
    INSERT INTO industries
    (code, name)
    VALUES
    ($1, $2)
    RETURNING code, name;`,
    [`sftw`, `software development`]
  );

  testIndustry = industryResults.rows[0];

  const companyIndustryResults = await db.query(
    `
    INSERT INTO company_industry
    (comp_code, industry_code)
    VALUES
    ($1, $2)
    RETURNING comp_code, industry_code`,
    [testCompanyAttached.code, testIndustry.code]
  );

  testCompanyIndustry = companyIndustryResults.rows[0];
});

afterEach(async function () {
  const ciDelete = db.query(`
    DELETE FROM company_industry;`);
  const cDelete = db.query(`
    DELETE FROM companies;`);
  const iDelete = db.query(`
    DELETE FROM industries;`);
  await Promise.all([ciDelete, cDelete, iDelete]);
});

afterAll(async function () {
  await db.end();
});

describe(`GET /industries`, function () {
  test(`Gets a list of industries`, async function () {
    const resp = await request(app).get(`/industries`);
    const respIndustry = resp.body[0];

    expect(resp.statusCode).toBe(200);
    expect(respIndustry.code).toEqual(testIndustry.code);
    expect(respIndustry.name).toEqual(testIndustry.name);
    expect(respIndustry.companies).toContain(testCompanyAttached.name);
  });
});

describe(`POST /industries`, function () {
  test(`Creates a new industry`, async function () {
    const resp = await request(app)
      .post(`/industries`)
      .send({ code: testCreateIndustry.code, name: testCreateIndustry.name });
    const respIndustry = resp.body.industry;

    expect(resp.statusCode).toBe(201);
    expect(respIndustry.code).toEqual(respIndustry.code);
    expect(respIndustry.name).toEqual(respIndustry.name);
  });
});

describe(`POST /industries/company`, function () {
  test(`Associates an industry to a company`, async function () {
    const resp = await request(app).post(`/industries/company`).send({
      comp_code: testCompanyFree.code,
      industry_code: testIndustry.code,
    });
    const association = resp.body.association;

    expect(resp.statusCode).toBe(201);
    expect(association.comp_code).toEqual(testCompanyFree.code);
    expect(association.industry_code).toEqual(testIndustry.code);
  });
});
