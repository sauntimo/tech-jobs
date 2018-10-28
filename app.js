var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
var sassMiddleware  = require('node-sass-middleware');
var favicon         = require('serve-favicon');
var mongoose        = require('mongoose');
var dotenv          = require('dotenv').config();
var session         = require('express-session');
var passport        = require('passport');

var indexRouter     = require('./routes/index');
var homeRouter      = require('./routes/home');
var profileRouter   = require('./routes/profile');

var app = express();

const db_un       = encodeURIComponent( process.env.DB_USERNAME );
const db_pwd      = encodeURIComponent( process.env.DB_PASSWORD );
const db_host     = process.env.DB_HOST
const db_database = process.env.DB_DATABASE
const db_url      = `mongodb://${db_un}:${db_pwd}@${db_host}/${db_database}`;

// connect to db
mongoose.connect(db_url, { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
    "secret"            : process.env.EXPRESS_SESSION_SECRET,
    "resave"            : true,
    "saveUninitialized" : true
}));

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/profile', profileRouter);
app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
