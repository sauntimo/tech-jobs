var express = require('express');
var router = express.Router();
var passportGithub = require('../auth/github');

// log user out of oauth session
router.get( '/', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
