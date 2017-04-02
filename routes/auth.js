const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../services/user.model');
const Tea = require('../services/encryption');
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
    const body = _.pickBy(_.pick(req.body, keys), _.isString);
    if (_.keys(body).length < keys.length) return res.json({ error: 'Invalid data' });
    const data = {};

    for (const name in body) {
        if (body.hasOwnProperty(name)) {
            data[name] = Tea.decrypt(body[name], name);
        }
    }

    UserModel.find({
        $or: [
            { username: data.username },
            { email: data.email }
        ]
    }, (err, users) => {
        if (err) return res.status(500).end('Server Internal Error');
        if (!users.length) {
            bcrypt.genSalt((err, salt) => {
                if (err) return res.status(500).end('Server Internal Error');
                bcrypt.hash(data.password, salt, (err, hash) => {
                    if (err) return res.status(500).end('Server Internal Error');
                    data.password = hash;
                    bcrypt.genSalt((err, authToken) => {
                        if (err) return res.status(500).end('Server Internal Error');
                        data.token = authToken;
                        const user = new UserModel(data);
                        user.save((err, u) => {
                            if (err) return res.status(500).end('Server Internal Error');
                            res.status(200).json({ success: true });
                        });
                    });
                });
            });
        } else {
            const error = [];
            if (users.some((user) => user.username === data.username))
            error.push(`Ya hay una persona registrada con el nombre de usuario "${data.username}"`);
            if (users.some((user) => user.email === data.email))
            error.push(`Ya hay una persona registrada con el correo electrónico "${data.email}"`);
            return res.json({ error });
        }
    });
});

router.get('/logout', (req, res, next) => {
    res.clearCookie('user_id');
    res.clearCookie('auth_token');
    res.status(200).redirect('/');
});

module.exports = router;
