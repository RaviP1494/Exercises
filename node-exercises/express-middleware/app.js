const express = require('express');
const itemRoutes = require('./itemRoutes.js');
const ExpressError = require('./expressError.js');

const app = express();

app.use(express.json());
app.use('/items', itemRoutes);

app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError);
});

app.use(function (err, req, res, next) {
    // console.log(`Status Code: ${err.status} | ${err.message}`);
    return res.status(err.status).json({ error: { status_code: err.status, message: err.message } });
})

// app.listen(3000, function () {
//     console.log('App on port 3000');
// })

module.exports = app;