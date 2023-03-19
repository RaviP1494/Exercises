const express = require(`express`);
const ExpressError = require(`../expressError`);
const slugify = require(`slugify`);
const db = require(`../db`);

const router = new express.Router();

router.get(`/`, async function (req, res, next) {
  try {
    const results = await db.query(`
        SELECT code, name, description 
        FROM COMPANIES;`);
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err);
  }
});

router.get(`/:code`, async function (req, res, next) {
  let results;
  try {
    results = await db.query(
      `
    SELECT c.code, c.name, c.description, i.name AS industry
    FROM companies AS c
    JOIN company_industry AS ci
    ON c.code = ci.comp_code
    JOIN industries AS i
    ON ci.industry_code = i.code
    WHERE c.code = $1`,
      [req.params.code]
    );
  } catch (err) {
    return next(err);
  }
  const industries = results.rows.map((row) => row.industry);
  const { code, name, description } = results.rows[0];
  const finalResults = {
    code: code,
    name: name,
    description: description,
    industries: industries,
  };
  return res.json(finalResults);
});

router.post(`/`, async function (req, res, next) {
  try {
    if (!req.body.name || !req.body.description) {
      throw new ExpressError(`Missing data`, 422);
    }
    const code = slugify(req.body.name.split(` `)[0]);
    const results = await db.query(
      `
        INSERT INTO companies (code, name, description) 
        VALUES ($1, $2, $3) 
        RETURNING code, name, description;`,
      [code, req.body.name, req.body.description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put(`/:code`, async function (req, res, next) {
  try {
    if (!req.body.name || !req.body.description) {
      throw new ExpressError(`Missing data`, 422);
    }
    const results = await db.query(
      `
        UPDATE companies SET name = $1, description = $2 
        WHERE code = $3 
        RETURNING code, name, description`,
      [req.body.name, req.body.description, req.params.code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company not found`, 404);
    }
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete(`/:code`, async function (req, res, next) {
  try {
    const results = await db.query(
      `
        DELETE FROM companies 
        WHERE code=$1 
        RETURNING code, name, description;`,
      [req.params.code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Company not found`, 404);
    }
    return res.json({ status: `deleted` });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
