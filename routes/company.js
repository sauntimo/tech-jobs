var express        = require('express');
var router         = express.Router();
var he             = require('he');
var mongoose       = require('mongoose');
var Company        = require('../models/company');
var User           = require('../models/user');
var CompanyService = require('../services/company');

const { body }         = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

router.get('/new', function(req, res, next){

    var company = {
        "name"           : "",
        "website"        : "",
        "size"           : "",
        "street_address" : "",
        "city"           : "",
        "postcode"       : ""
    }

    var data = {
        "title"       : "Create a new company",
        "form_action" : '/company/new',
        "form_verb"   : 'Create',
        company
    };

    res.render('company/edit', data);
});

router.get('/edit', async function(req, res, next){

    var company = {};
    var rst_company = await CompanyService.getCompany( req.user.company_id );

    if( !rst_company.success ){
        res.redirect( '/home' );
    }
    
    company = rst_company.data[0];

    var data = {
        "title"       : "Edit company",
        "form_action" : '/company/edit',
        "form_verb"   : 'Update',
        company
    };

    // decode escaped website
    data.company.website = he.decode( company.website );

    res.render('company/edit', data);
});



// sanitise our user input
const arr_validators = [
    body( 'name' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'website' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'size' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'street_address' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'city' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'postcode' )
        .not().isEmpty()
        .trim()
        .escape(),
];

router.post( '/new', arr_validators, function( req, res, next ){

    Company.create( 
        {
            "name"           : req.body.name,
            "website"        : req.body.website,
            "size"           : req.body.size,
            "street_address" : req.body.street_address,
            "city"           : req.body.city,
            "postcode"       : req.body.postcode,
            "employees"      : [ req.user._id ]
        },
        function ( err, company ){
            if( err ){
                res.redirect( '/profile/new' )
            }

            User.findByIdAndUpdate(
                req.user._id,
                {
                    $set : { company_id : company._id }
                },
                function( err, user ){
                    if( err ){
                        res.redirect( '/profile/new' )
                    }
                }
            )

            res.redirect( '/home' )
        }
    );
})


router.post( '/edit', arr_validators, function( req, res, next ){

    Company.findByIdAndUpdate(
        req.user.company_id, 
        {
            "name"           : req.body.name,
            "website"        : req.body.website,
            "size"           : req.body.size,
            "street_address" : req.body.street_address,
            "city"           : req.body.city,
            "postcode"       : req.body.postcode,
            "employees"      : [ req.user._id ]
        },
        function ( err, company ){
            if( err ){
                res.redirect( '/profile/edit' )
            }
            res.redirect( '/home' )
        }
    );
})


module.exports = router;