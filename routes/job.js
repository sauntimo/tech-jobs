var express        = require('express');
var router         = express.Router();
var he             = require('he');
var mongoose       = require('mongoose');
var Job            = require('../models/job');
var Company        = require('../models/company');
var User           = require('../models/user');
var CompanyService = require('../services/company');
var JobService     = require('../services/job');
var helper         = require('../lib/helper');


const { body }         = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

router.get('/new', helper.ensureAuthenticated, async function(req, res, next){

	var rst_company = await CompanyService.getCompany( req.user.company_id );

	if( !rst_company.success ){
		res.redirect( '/home' );
	} 

	company = rst_company.data[0];

    var job = {
        "title"          : "",
        "salary_min"     : "",
        "salary_max"     : "",
        "description"    : "",
        "experience"     : "",
        "tech"           : "",
        "deadline"       : "",
        "company_id"     : mongoose.Types.ObjectId( req.user.comapny_id ),
        "company_name"   : company.name
    };

    var data = {
        "title"        : "Create a new job posting",
        "form_action"  : '/job/new',
        "form_verb"    : 'Create',
        job
    };

    res.render('job/edit', data);
});

router.get( '/search', helper.ensureAuthenticated, async function(req, res, next){

	var data = {};
	var query = {};

	var rst_jobs = await JobService.findJobs( query );

	console.log( rst_jobs );

	if( !rst_jobs.success ){
		res.redirect( '/home' );
	}

	data.jobs = rst_jobs.data;

	res.render( 'job/search', data );

})


router.get('/edit/:job_id', helper.ensureAuthenticated, async function(req, res, next){

    var job = {};
    var rst_job = await JobService.getJob( req.params.job_id );

    if( !rst_job.success ){
        res.redirect( '/home' );
    }
    
    job = rst_job.data[0];

    var data = {
        "title"       : "Edit job",
        "form_action" : '/job/edit',
        "form_verb"   : 'Update',
        job
    };

    res.render('job/edit', data);
});

// sanitise our user input
const arr_validators = [
    body( 'title' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'salary_min' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'salary_max' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'description' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'experience' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'tech' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'deadline' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'company_id' )
        .not().isEmpty()
        .trim()
        .escape(),
    body( 'company_name' )
        .not().isEmpty()
        .trim()
        .escape()
];

router.post( '/new', helper.ensureAuthenticated, arr_validators, function( req, res, next ){

    Job.create( 
        {
        	"title"          : req.body.title,
	        "salary_min"     : req.body.salary_min,
	        "salary_max"     : req.body.salary_max,
	        "description"    : req.body.description,
	        "experience"     : req.body.experience,
	        "tech"           : req.body.tech,
	        "deadline"       : req.body.deadline,
	        "company_id"     : req.body.company_id,
	        "company_name"   : req.body.company_name
        },
        function ( err, job ){
            if( err ){
            	console.log( err )
                res.redirect( '/job/new' )
            }

            Company.findByIdAndUpdate(
                req.user.company_id,
                {
                    $push : { jobs : job._id }
                },
                function( err, user ){
                    if( err ){
                    	console.log( err )
                        res.redirect( '/job/new' )
                    }
                }
            )

            res.redirect( '/home' )
        }
    );
})


router.post( '/edit', helper.ensureAuthenticated, arr_validators, function( req, res, next ){

    Job.findByIdAndUpdate(
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
