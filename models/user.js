var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

// create User Schema
var User = new Schema({
    "gh_name"         : String,
    "gh_id"           : String,
    "gh_login"        : String,
    "gh_avatar_url"   : String,
    "gh_bio"          : String,
    "display_name"    : String,
    "postcode"        : String,
    "company_id"      : ObjectId
});

module.exports = mongoose.model('users', User);
