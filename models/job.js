var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

// create Company Schema
var Job = new Schema({
    "title"          : String,
    "salary_min"     : Number,
    "salary_max"     : Number,
    "description"    : String,
    "experience"     : String,
    "tech"           : String,
    "deadline"       : String,
    "company_name"   : String,
    "company_id"     : ObjectId
});

module.exports = mongoose.model('job', Job);
