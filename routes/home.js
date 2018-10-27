var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/***
  *    Check user is authenticated
 ***/
function isAuthenticated(req, res, next) {

    // if authenticated continue
    if( req.user.hasOwnProperty( 'gh_id' ) ){
        return next();
    }

    // otherwise redirect home
    res.redirect('/');
}


/* GET home page. */
router.get('/', function(req, res, next) {

    var data = {
        "user" : req.user
    };
    
    res.render('home/home', data);
});

module.exports = router;
