var mongoose = require('mongoose');
var Job      = require('../models/job');

module.exports = {

    /***
      *    Async function to get job from db
      *    @param job_id mongodb ObjectId of job
      *    @return wrapper with job object
     ***/

    "getJob": async function( job_id ){

        return new Promise( ( resolve, reject ) => {
            
            // get the Job
            Job.findById( job_id, ( error, job ) => {
                // if that failed, reject the promise with the error message
                if( error ){ 
                    reject( error.message );
                }

                // resolve with the job object
                resolve( job );
            })

        }).then(
            // promise resolved
            ( job ) => {
                return {
                    "success" : true,
                    "msg"     : 'Successfully retreieved job',
                    "data"    : [ job ]
                };
            },
            // promise rejected
            ( error ) => {
                return {
                    "success" : false,
                    "msg"     : 'Failed to get the job: ' + error,
                    "data"    : []
                };
            }
        )
    },

    "findJobs": async function( query ){

        return new Promise( ( resolve, reject ) => {
            
            // get the Job
            Job.find( query, ( error, jobs ) => {
                // if that failed, reject the promise with the error message
                if( error ){ 
                    reject( error.message );
                }

                // resolve with the job object
                resolve( jobs );
            })

        }).then(
            // promise resolved
            ( jobs ) => {
                return {
                    "success" : true,
                    "msg"     : 'Successfully retrieved jobs',
                    "data"    : jobs
                };
            },
            // promise rejected
            ( error ) => {
                return {
                    "success" : false,
                    "msg"     : 'Failed to get the job: ' + error,
                    "data"    : []
                };
            }
        )
    }

}
