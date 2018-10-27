var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
    "name"            : String,
    "gh_id"           : String,
    "gh_login"        : String,
    "gh_avatar_url"   : String,
    "gh_bio"          : String
});

module.exports = mongoose.model('users', User);
