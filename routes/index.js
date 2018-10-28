var express = require('express');
var router = express.Router();
var passportGithub = require('../auth/github');

var data = {
	"title"       : "Tech Jobs Bristol",
	"intro"       : "A transparent jobs board by developers for developers.",
	"explanation" : `No recuitment agencies, ever. Just companies with tech jobs 
		and people looking for them. Simple.`,
	"cta_text"    : 'Log in with GitHub'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', data);
});

var passport_config = {
    "scope"        : [ 'user:email' ],
    "failureFlash" : "GitHub authentication failed"
};

router.get('/auth/github', passportGithub.authenticate('github', passport_config));

router.get('/auth/github/callback',
    passportGithub.authenticate('github', { failureRedirect: '/' }),
    
    // Successful authentication
    function(req, res) {
        res.redirect('/home');
    });

module.exports = router;
