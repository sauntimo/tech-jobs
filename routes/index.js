var express = require('express');
var router = express.Router();


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

module.exports = router;
