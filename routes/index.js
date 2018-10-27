var express = require('express');
var router = express.Router();
var passportGithub = require('../auth/github');

var data = {
	"title"       : "Tech Jobs Bristol",
	"intro"       : "A transparent jobs board by developers for developers.",
	"explanation" : `No recuitment agencies, ever. Just people with tech jobs 
		and people looking for them. Simple.`,
	"cta_text"    : 'Log in with GitHub'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', data);
});

router.get('/login', function(req, res, next) {
  res.send('You need to register');
});


var passportGithub = require('../auth/github');

router.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
    passportGithub.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication
        res.json(req.user);
    });

module.exports = router;
