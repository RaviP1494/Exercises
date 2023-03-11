const express = require('express');
const ExpressError = require('./expressError');

const app = express();

app.get('/mean', function (req, res, next) {
    try {
        const queryStr = req.query['nums'] ? req.query['nums'] : null;
        if (!req.query['nums']) {
            throw new ExpressError('nums are required', 400);
        }
        const nums = req.query['nums'].split(',');
        //const value = mean(nums);
        let total = 0;
        for (const num of nums) {
            const n = parseInt(num);
            if (!n) {
                throw new ExpressError('Not a number', 400);
            }
            total += n;
        }
        const value = total / nums.length;
        return res.json({
            'operation': 'mean',
            'value': value
        })
    } catch (e) {
        next(e);
    }
});

app.get('/median', function (req, res, next) {
    try {
        if (!req.query['nums']) {
            throw new ExpressError('nums are required', 400);
        }
        const nums = req.query['nums'].split(',');
        for (const num of nums) {

            const n = parseInt(num);
            if (!n) {
                throw new ExpressError('Not a number', 400);
            }

        }
        let value;
        let sortedNums = nums.sort();
        const length = sortedNums.length;
        if (sortedNums.length % 2 === 1) {
            value = sortedNums[(length - 1) / 2];
        }
        else {
            value = (parseInt(sortedNums[length / 2 - 1]) + parseInt(sortedNums[length / 2])) / 2;
        }
        return res.json({
            'operation': 'median',
            'value': value
        })
    } catch (e) {
        next(e);
    }
});

app.get('/mode', function (req, res, next) {
    try {
        let sortedNums = [];
        if (!req.query['nums']) {
            throw new ExpressError('nums are required', 400);
        }
        const nums = req.query['nums'].split(',');
        for (const num of nums) {
            const n = parseInt(num);
            if (!n) {
                throw new ExpressError('Not a number', 400);
            }
            sortedNums.push(n);
        }
        sortedNums.sort();

        let winning = sortedNums[0];
        let current = sortedNums[0];
        let winning_count = 1;
        let current_count = 1;
        for (let i = 1; i < sortedNums.length; i++) {
            if (sortedNums[i] === current) {
                current_count++;
            }
            else {
                if (current_count >= winning_count) {
                    winning = current;
                    winning_count = current_count;
                    current_count = 1;
                    current = sortedNums[i];
                }
                else {
                    current_count = 1;
                    current = sortedNums[i];
                }
            }
        }
        return res.json({
            'operation': 'mode',
            'value': winning
        })
    } catch (e) {
        next(e);
    }
})

app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message;

    return res.status(error.status).json({
        error: {message, status}
    });
})

app.listen(5000, function () {
    console.log('App on port 5000');
});