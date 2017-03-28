const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
    res.send('/');
});

router.get('/signin', (req, res, next) => {
    res.send('/signin');
});

router.get('/signup', (req, res, next) => {
    res.send('/signup');
});

module.exports = router;
