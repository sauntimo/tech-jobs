var mongoose = require('mongoose');
var Company  = require('../models/company');

module.exports = {

    /***
      *    Async function to get a company from db
      *    @param company_id mongodb ObjectId of Company
      *    @return wrapper with comapny object
     ***/

    "getCompany": async function( company_id ){

        console.log( 'company_id: ' + company_id )

        return new Promise( ( resolve, reject ) => {
            
            // get the company
            Company.findById( company_id, ( error, company ) => {
                // if that failed, reject the promise with the error message
                if( error ){ 
                    reject( error.message );
                }

                // resolve with the company object
                resolve( company );
            })

        }).then(
            // promise resolved
            ( company ) => {
                return {
                    "success" : true,
                    "msg"     : 'Successfully retrieved company',
                    "data"    : [ company ]
                };
            },
            // promise rejected
            ( error ) => {
                return {
                    "success" : false,
                    "msg"     : 'Failed to get the company: ' + error,
                    "data"    : []
                };
            }
        )
    },

    "findCompanies": async function( query ){

        return new Promise( ( resolve, reject ) => {
            
            // get the Job
            Company.find( query, ( error, companies ) => {
                // if that failed, reject the promise with the error message
                if( error ){ 
                    reject( error.message );
                }

                // resolve with the company object
                resolve( companies );
            })

        }).then(
            // promise resolved
            ( companies ) => {
                return {
                    "success" : true,
                    "msg"     : 'Successfully retrieved companies',
                    "data"    : companies
                };
            },
            // promise rejected
            ( error ) => {
                return {
                    "success" : false,
                    "msg"     : 'Failed to get the company: ' + error,
                    "data"    : []
                };
            }
        )
    }

}
