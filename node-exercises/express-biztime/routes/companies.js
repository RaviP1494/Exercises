const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

const router = new express.Router();

router.get('/', async function (req, res, next) {
    try {
        const results = await db.query('SELECT code, name, description FROM COMPANIES;');
        return res.json({ companies: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.get('/:code', async function (req, res, next) {
    try {
        const results = await db.query(`SELECT code, name, description FROM companies WHERE code = $1;`, [req.params.code]);
        if (results.rows.length === 0) { throw new ExpressError('Company not found', 404); }
        return res.json({ company: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        if (!req.body.code || !req.body.name || req.body.description) { throw new ExpressError("Missing data", 422) }
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description;`, [req.body.code, req.body.name, req.body.description]);
        return res.json({ company: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.put('/:code', async function (req, res, next) {
    try {
        const results = await db.query(`UPDATE companies SET code = $1, name = $2, description = $3 WHERE code = $4 RETURNING code, name, description`, [req.body.code, req.body.name, req.body.description, req.params.code]);
        if (results.rows.length === 0) { throw new ExpressError('Company not found', 404); }
        return res.json({ company: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.delete('/:code', async function (req, res, next) {
    try {
        const results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code, name, description;`, [req.params.code]);
        return res.json({ status: 'deleted' });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = router;