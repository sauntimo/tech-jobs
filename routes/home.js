var express        = require('express');
var router         = express.Router();
var mongoose       = require('mongoose');
var Company        = require('../models/company');
var CompanyService = require('../services/company');

/***
  *    Check user is authenticated
 ***/
function isAuthenticated(req, res, next) {

    // if authenticated continue
    if( 
        req.hasOwnProperty( 'user' ) &&
        req.user.hasOwnProperty( 'gh_id' )
    ){
        return next();
    }

    // otherwise redirect home
    res.redirect('/');
}


/* GET home page. */
router.get('/', async function(req, res, next) {

    var data = {
        "user"            : req.user,
        "has_company"     : false,
        "companies_intro" : `Search local companies or create your own if you 
            want to post a job`,
        "jobs_intro"      : `Search job postings from local companies. Your 
            account needs to be associated with a company before you can post
            a new job.` 
    };

    if( req.user.company_id ){

        let rst_company = await CompanyService.getCompany( req.user.company_id );

        if( rst_company.success ){
            var company = rst_company.data[0];
            data.has_company = true;
            data.companies_intro = `Search local companies or edit the 
                ${company.name} company profile.`;
            data.jobs_intro = `Search job postings from local companies or 
                post a job at ${company.name}.`;
            data.company = company;
        }

    }
    
    res.render( 'home/home', data );
});

module.exports = router;
