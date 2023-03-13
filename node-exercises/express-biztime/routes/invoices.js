const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

const router = new express.Router();

router.get('/', async function (req, res, next) {
    try {
        const results = await db.query('SELECT id, comp_Code, amt, paid, paid_date FROM invoices;');
        return res.json({ invoices: results.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const invoiceResults = await db.query('SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id = $1;', [req.params.id]);
        if (invoiceResults.rows.length === 0) { throw new ExpressError('Invoice not found', 404); }
        const invoice = invoiceResults.rows[0];
        const companyResults = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [invoice.comp_code]);
        const company = companyResults.rows[0];
        delete invoice.comp_code;
        invoice.company = company;
        return res.json({ invoice: invoice });
    }
    catch (err) {
        return next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        if (!req.body.comp_code || !req.body.amt) { throw new ExpressError('Missing data', 422) };
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date;', [req.body.comp_code, req.body.amt]);
        return res.json({ invoice: results.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const results = await db.query('UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [req.body.amt, req.params.id]);
        if (results.rows.length === 0) { throw new ExpressError('Invoice not found', 404); }
        return res.json(results.rows);
    }
    catch (err) {
        return next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const results = await db.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);
        return res.json({ status: 'deleted' });
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;