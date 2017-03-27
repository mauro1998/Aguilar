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

const getNavigationList = (url) => {
  return navlist.map((navitem) => {
    navitem.active = navitem.href === url;
    return navitem;
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { navlist: getNavigationList(req.url) });
});

router.get('/services', function(req, res, next) {
  res.render('index', { navlist: getNavigationList(req.url) });
});

router.get('/blog', function(req, res, next) {
  res.render('index', { navlist: getNavigationList(req.url) });
});

router.get('/contact', function(req, res, next) {
  res.render('index', { navlist: getNavigationList(req.url) });
});

router.get('/signin', function(req, res, next) {
  res.render('login', { navlist: getNavigationList(req.url) });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { navlist: getNavigationList(req.url) });
});

module.exports = router;
