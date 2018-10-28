var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

// create Company Schema
var Company = new Schema({
    "name"           : String,
    "website"        : String,
    "size"           : Number,
    "street_address" : String,
    "city"           : String,
    "postcode"       : String,
    "employees"      : [ObjectId]
});

module.exports = mongoose.model('company', Company);
