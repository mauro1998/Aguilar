const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../services/user.model');
const Tea = require('../services/encryption');
const _ = require('lodash');

// Validate user credentials
router.post('/signin', (req, res, next) => {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    if (loggedIn) return res.redirect('/');
    const keys = ['username', 'password'];
    const body = _.pick(req.body, keys);
    if (_.keys(body).length < keys.length) return res.json({ error: 'Invalid data' });
    const data = {
        username: Tea.decrypt(body.username, 'username'),
        password: Tea.decrypt(body.password, 'password')
    };

    UserModel.findOne({
        $or: [
            { email: data.username },
            { username: data.username }
        ]
    }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).end('Server Internal Error');
        }
        const msg = 'El usuario y la contraseña no coinciden, por favor intentelo nuevamente';
        if (!user) return res.json({ error: msg });

        bcrypt.compare(data.password, user.password, (err, isValid) => {
            if (err) {
                console.log(err);
                return res.status(500).end('Server Internal Error');
            }
            if (isValid) {
                const options = { signed: true, maxAge: 1000 * 60 * 60 * 24 };
                res.cookie('user_id', user._id, options);
                res.cookie('auth_token', user.token, options);
                return res.json({ loggedIn: true });
            }

            return res.json({ error: msg });
        });
    });
});

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

router.post('/email', (req, res, next) => {
    const email = req.body.email.trim();
    if (!email) return res.json({ valid: false });
    UserModel.findOne({ email }, (err, user) => {
        if (err) return res.status(500).end('Server Internal Error');
        return res.json({ valid: user === null });
    });
});

router.post('/username', (req, res, next) => {
    const username = req.body.username.trim();
    if (!username) return res.json({ valid: false });
    UserModel.findOne({ username }, (err, user) => {
        if (err) return res.status(500).end('Server Internal Error');
        return res.json({ valid: user === null });
    });
});

router.get('/logout', (req, res, next) => {
    res.clearCookie('user_id');
    res.clearCookie('auth_token');
    res.status(200).redirect('/');
});

module.exports = router;
