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

    var company = rst_company.data[0];

    var job = {
        "title"          : "",
        "salary_min"     : "",
        "salary_max"     : "",
        "description"    : "",
        "experience"     : "",
        "tech"           : "",
        "deadline"       : "",
        "company_id"     : req.user.company_id,
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

    if( !rst_jobs.success ){
        res.redirect( '/home' );
    }

    data.jobs = rst_jobs.data;

    res.render( 'job/search', data );

})

router.get( '/search/company/:company_id', helper.ensureAuthenticated, async function(req, res, next){

    var rst_company = await CompanyService.getCompany( req.params.company_id );

    // redirect on fail TODO: feedback
    if( !rst_company.success ){
        res.redirect( '/home' )
    }

    var company = rst_company.data[0];

    var query = { "company_id" : req.params.company_id };

    var rst_jobs = await JobService.findJobs( query );

    // redirect on fail TODO: feedback
    if( !rst_jobs.success ){
        res.redirect( '/home' );
    }

    var jobs = rst_jobs.data;

    var data = {
        title : 'Jobs at ' + company.name,
        jobs,
        company
    };

    res.render( 'job/search', data );

})


router.get( '/view/:job_id', helper.ensureAuthenticated, async function( req, res, next ){

    var job = {};
    var company = {};

    // get the job details from the db
    var rst_job = await JobService.getJob( req.params.job_id );

    // redirect on fail. TODO: feedback
    if( !rst_job.success ){
        res.redirect( '/home' );
    }
    
    job = rst_job.data[0];

    // get the company that owns the job from the db
    var rst_company = await CompanyService.getCompany( job.company_id );

    // redirect on fail. TODO: feedback
    if( !rst_company.success ){
        res.redirect( '/home' );
    }

    company = rst_company.data[0];

    company.website = he.decode( company.website );
    job.deadline = he.decode( job.deadline );

    var data = {
        "editable" : false,
        job,
        company
    };

    // if this user is an employee of the company that owns this job,
    // they can edit it
    if( job.company_id.equals( req.user.company_id ) ){
        data.editable = true;
    }

    res.render('job/view', data);

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
        "form_action" : '/job/edit/' + req.params.job_id,
        "form_verb"   : 'Update',
        "job_id"      : req.params.job_id,
        job
    };

    data.job.deadline = he.decode( job.deadline );

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

router.post( '/new', helper.ensureAuthenticated, arr_validators, async function( req, res, next ){

    var rst_company = await CompanyService.getCompany( req.body.company_id );

    if( !rst_company.success ){
        return res.redirect( '/home' );
    } 

    var company = rst_company.data[0];

    Job.create( 
        {
            "title"          : req.body.title,
            "salary_min"     : req.body.salary_min,
            "salary_max"     : req.body.salary_max,
            "description"    : req.body.description,
            "experience"     : req.body.experience,
            "tech"           : req.body.tech,
            "deadline"       : req.body.deadline,
            "company_id"     : company._id,
            "company_name"   : req.body.company_name
        },
        function ( err, job ){
            if( err ){
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


router.post( '/edit/:job_id', helper.ensureAuthenticated, arr_validators, function( req, res, next ){

    Job.findByIdAndUpdate(
        req.params.job_id, 
        {
            "title"          : req.body.title,
            "salary_min"     : req.body.salary_min,
            "salary_max"     : req.body.salary_max,
            "description"    : req.body.description,
            "experience"     : req.body.experience,
            "tech"           : req.body.tech,
            "deadline"       : req.body.deadline
        },
        function ( err, job ){
            if( err ){
                res.redirect( '/home' );
            }
            res.redirect( '/job/view/' + req.params.job_id );
        }
    );
})

// This isn't very RESTful, this should probably be a DELETE verb 
// but that involves some kind of http request?
router.get( '/delete/:job_id', helper.ensureAuthenticated, async function( req, res, next ){

    var job = {};
    var rst_job = await JobService.getJob( req.params.job_id );

    if( !rst_job.success ){
        res.redirect( '/home' );
    }
    
    job = rst_job.data[0];

    if( !job.company_id.equals( req.user.company_id ) ){
        return res.redirect( '/home' );
    }

    Job.findByIdAndRemove(
        req.params.job_id,
        function( err, result ){
            if( err ){
                res.redirect( '/job/view/' + req.params.job_id );
            }
            res.redirect( '/job/search' );
        }
    )

})

module.exports = router;
