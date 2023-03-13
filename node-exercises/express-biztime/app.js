/** BizTime express application. */

const express = require("express");
const companiesRoutes = require("./routes/companies");
const invoiceRoutes = require('./routes/invoices');

const app = express();
const ExpressError = require("./expressError")

app.use(express.json());
app.use("/companies", companiesRoutes);
app.use("/invoices", invoiceRoutes);


/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status,
      message: err.message
    }
  });
});

app.listen(3000, function () {
  console.log('server running');
})


module.exports = app;
