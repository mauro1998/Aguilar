const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const index = require('./routes/index');
const auth = require('./routes/auth');
const app = express();
const config = {
    cookieSecret: 'Aguilar',
    sessionSecret: 'Construcciones&Reformas'
};

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/db_aguilar');
const User = require('./services/user.model');

// View engine setup
const templatesDir = path.join(__dirname, 'templates');
const layoutsDir = path.join(templatesDir, 'layouts');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'base', layoutsDir }));
app.set('views', templatesDir);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieSecret));
app.use(cookieSession({ secret: config.sessionSecret }));
app.use(csurf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/auth', auth);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error', { token: req.csrfToken() });
});

module.exports = app;
