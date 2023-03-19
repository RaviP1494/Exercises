const express = require(`express`);
const ExpressError = require(`../expressError`);
const db = require(`../db`);

const router = new express.Router();

router.get(`/`, async function (req, res, next) {
  let results;

  try {
    results = await db.query(`
        SELECT i.code, i.name, c.name AS company
        FROM industries AS i
        LEFT JOIN company_industry AS ci
        ON i.code = ci.industry_code
        LEFT JOIN companies AS c
        ON c.code = ci.comp_code
        ORDER BY i.code;
        `);
  } catch (err) {
    return next(err);
  }
  const industries = [];
  let lastRow;
  for (const currRow of results.rows) {
    if (!lastRow || lastRow.code !== currRow.code) {
      if (currRow.company) {
        currRow.companies = [currRow.company];
      }
      industries.push(currRow);
      lastRow = currRow;
    } else {
      const lastIndustry = industries.find((ind) => ind.code === lastRow.code);
      lastIndustry.companies.push(currRow.company);
      lastRow = currRow;
    }
    delete currRow.company;
  }
  return res.json(industries);
});

router.post(`/`, async function (req, res, next) {
  let results;
  try {
    if (!req.body.code || !req.body.name) {
      throw new ExpressError(`Missing data`, 422);
    }
  } catch (err) {
    return next(err);
  }
  const { code, name } = req.body;
  try {
    results = await db.query(
      `
    INSERT INTO industries
    (code, name)
    VALUES
    ($1, $2)
    RETURNING code, name;`,
      [code, name]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Unable to add`, 400);
    }
  } catch (err) {
    return next(err);
  }
  const addedIndustry = results.rows[0];
  return res.status(201).json({ industry: addedIndustry });
});

router.post(`/company`, async function (req, res, next) {
  let results;
  try {
    if (!req.body.comp_code || !req.body.industry_code) {
      throw new ExpressError(`Missing data`, 422);
    }
  } catch (err) {
    return next(err);
  }
  const { comp_code, industry_code } = req.body;
  try {
    results = await db.query(
      `
    INSERT INTO company_industry
    (comp_code, industry_code)
    VALUES
    ($1, $2)
    RETURNING comp_code, industry_code`,
      [comp_code, industry_code]
    );
  } catch (err) {
    return next(err);
  }
  return res.status(201).json({
    association: { comp_code: comp_code, industry_code: industry_code },
  });
});

module.exports = router;
