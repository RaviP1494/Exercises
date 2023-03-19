const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

const router = new express.Router();

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(`
        SELECT id, comp_Code 
        FROM invoices;`);
    return res.json({ invoices: results.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const invoiceResults = await db.query(
      `
        SELECT id, comp_code, amt, paid, paid_date, add_date 
        FROM invoices 
        WHERE id = $1;
        `,
      [req.params.id]
    );
    if (invoiceResults.rows.length === 0) {
      throw new ExpressError("Invoice not found", 404);
    }
    const invoice = invoiceResults.rows[0];
    const companyResults = await db.query(
      `
        SELECT code, name, description 
        FROM companies 
        WHERE code = $1;`,
      [invoice.comp_code]
    );
    delete invoice.comp_code;
    const company = companyResults.rows[0];
    invoice.company = company;
    return res.json({ invoice: invoice });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  const { comp_code, amt } = req.body;
  try {
    if (!comp_code || !amt) {
      throw new ExpressError("Missing data", 422);
    }
    const results = await db.query(
      `
        INSERT INTO invoices 
        (comp_code, amt) 
        VALUES ($1, $2) 
        RETURNING id, comp_code, amt, paid, add_date, paid_date;
        `,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  const { amt, paid } = req.body;
  const id = req.params.id;
  let oldPaidDateResults;

  try {
    if (!amt) {
      throw new ExpressError(`Missing Amount(req.data.amt)`, 422);
    }
    oldPaidDateResults = await db.query(
      `SELECT paid_date
        FROM invoices
        WHERE id=$1`,
      [id]
    );
    if (oldPaidDateResults.rows.length === 0) {
      throw new ExpressError(`Invoice not found`, 404);
    }
  } catch (err) {
    return next(err);
  }

  const oldPaidDate = oldPaidDateResults.rows[0].paid_date;

  let paidDate;
  if (paid) {
    paidDate = new Date();
  } else if (oldPaidDate) {
    paidDate = oldPaidDate;
  } else {
    paidDate = null;
  }

  let updatedResults;
  try {
    updatedResults = await db.query(
      `UPDATE invoices
        SET amt=$1, paid=$2, paid_date=$3
        WHERE id=$4 
        RETURNING id, comp_code, amt, paid, add_date, paid_date;`,
      [amt, paid, paidDate, id]
    );
  } catch (err) {
    return next(err);
  }

  return res.json({ invoice: updatedResults.rows[0] });
});

router.delete("/:id", async function (req, res, next) {
  try {
    const results = await db.query(
      `
        DELETE FROM invoices 
        WHERE id = $1 
        RETURNING id;`,
      [req.params.id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError("Invoice not found", 404);
    }
    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
