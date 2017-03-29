const express = require('express');
const router = express.Router();
const navlist = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contáctenos', href: '/contact' },
    { name: 'Ingresar', href: '/signin' },
    { name: 'Registrarse', href: '/signup' }
];

const getNavigationList = (url, loggedIn) => {
    const nav = navlist.map((navitem) => {
        navitem.active = navitem.href === url;
        return navitem;
    }).filter((navitem) => {
        if (loggedIn) return navitem.href !== '/signin' && navitem.href !== '/signup';
        return navitem;
    });

    return nav;
};

/* GET Home page. */
router.get('/', function(req, res, next) {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    res.render('index', {
        token: req.csrfToken(),
        navlist: getNavigationList(req.url, loggedIn),
        loggedIn
    });
});

router.get('/services', function(req, res, next) {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    res.render('index', {
        token: req.csrfToken(),
        navlist: getNavigationList(req.url, loggedIn),
        loggedIn
    });
});

router.get('/blog', function(req, res, next) {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    res.render('index', {
        token: req.csrfToken(),
        navlist: getNavigationList(req.url, loggedIn),
        loggedIn
    });
});

router.get('/contact', function(req, res, next) {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    res.render('index', {
        token: req.csrfToken(),
        navlist: getNavigationList(req.url, loggedIn),
        loggedIn
    });
});

router.get('/signin', function(req, res, next) {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    if (loggedIn)  return res.redirect('/');
    res.render('login', {
        token: req.csrfToken(),
        navlist: getNavigationList(req.url, loggedIn),
        loggedIn
    });
});

router.get('/signup', function(req, res, next) {
    const loggedIn = req.signedCookies.auth_token !== undefined;
    if (loggedIn) return res.redirect('/');
    res.render('signup', {
        token: req.csrfToken(),
        navlist: getNavigationList(req.url, loggedIn),
        loggedIn
    });
});

module.exports = router;
