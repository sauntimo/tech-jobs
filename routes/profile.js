var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var User     = require('../models/user');
var helper   = require('../lib/helper');

const { body }         = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

router.get('/edit', helper.ensureAuthenticated, function(req, res, next){

    var data = {
        "user" : req.user
    };

    res.render('profile/edit', data);
});

// sanitise our user input
const arr_validators = [
    body( 'display_name' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'postcode' )
        .trim()
        .escape()
];

router.post( '/edit', helper.ensureAuthenticated, arr_validators, function( req, res, next ){


    User.findByIdAndUpdate( req.user._id, 
        {  
            $set: {
                "display_name" : req.body.display_name,
                "postcode"     : req.body.postcode
            }
        }, 
        { 
            "new" : true
        }, 
        function (err, user) {
            if(err){
                res.redirect( '/profile/edit' )
            }
            res.redirect( '/home' )
        }
    );
})

module.exports = router;
