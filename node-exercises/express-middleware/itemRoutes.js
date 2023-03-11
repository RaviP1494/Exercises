const express = require('express');
const items = require('./fakeDb.js');
const ExpressError = require('./expressError.js');

const router = new express.Router();

router.get('/', function (req, res) {
    return res.json(items);
});

router.post('/', function (req, res, next) {
    try {
        if (!req.body.name || !req.body.price) { throw new ExpressError('invalid name or price', 422); }
        const name = req.body.name;
        const price = req.body.price;
        const item = { name: name, price: price };
        items.push(item);
        return res.status(201).json(item);
    } catch (err) {
        return next(err);
    }
});

router.get('/:name', function (req, res, next) {
    try {
        const item = items.find(item => item.name === req.params.name);
        if (item === undefined) { throw new ExpressError('name not found', 406) };
        return res.json(item);
    } catch (err) {
        return next(err);
    }
});

router.patch('/:name', function (req, res, next) {
    try {
        const item = items.find(el => el.name === req.params.name);
        if (item === undefined || !req.body.name || !req.body.price) { throw new ExpressError('name not found', 406) };
        item.name = req.body.name;
        item.price = req.body.price;
        return res.json({ updated: item });
    } catch (err) {
        return next(err);
    }
})

router.delete('/:name', function (req, res, next) {
    try {
        const itemIndex = items.findIndex(el => el.name === req.params.name);
        if (itemIndex === -1) { throw new ExpressError('name not found', 406) }
        items.splice(itemIndex, 1);
        return res.json({ 'message': 'deleted' });
    } catch (err) {
        return next(err);
    }
})

module.exports = router;