const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../services/user.model');
const _ = require('lodash');

// Validate user credentials
router.post('/signin', (req, res, next) => {
    res.send('/signin');
});

// Register a new user
router.post('/signup', (req, res, next) => {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    if (loggedIn) return res.redirect('/');
    const keys = ['firstName', 'lastName', 'email', 'username', 'password'];
    const data = _.pickBy(_.pick(req.body, keys), _.isString);
    console.log('\n', req.body, data);
    if (_.keys(data).length < keys.length) return res.json({ error: 'Invalid data' });

    bcrypt.genSalt((err, salt) => {
        if (err) res.status(500).end('Server Internal Error');
        bcrypt.hash(data.password, salt, (err, hash) => {
            if (err) res.status(500).end('Server Internal Error');
            data.password = hash;
            bcrypt.genSalt((err, authToken) => {
                if (err) res.status(500).end('Server Internal Error');
                data.token = authToken;
                console.log(JSON.stringify(data, null, 2));
                const user = new UserModel(data);
                console.log(JSON.stringify(user, null, 2));
                res.status(200).end('Good!');
            });
        });
    });
});

router.get('/logout', (req, res, next) => {
    res.clearCookie('user_id');
    res.clearCookie('auth_token');
    res.status(200).redirect('/');
});

module.exports = router;
