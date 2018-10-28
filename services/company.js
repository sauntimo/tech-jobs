var mongoose = require('mongoose');
var Company  = require('../models/company');

module.exports = {

    /***
      *    Async functionto get user's company from db
      *    @param company_id mongodb ObjectId of Company
      *    @return wrapper with comapny object
     ***/

    "getCompany": async function( company_id ){

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
                    "msg"     : 'Successfully retreieved company',
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
    }

}
