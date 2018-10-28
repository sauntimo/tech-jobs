var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var User = require('../models/user');
var init = require('./init');

passport.use(new GitHubStrategy({
    "clientID"     : process.env.GITHUB_DEV_CLIENT_ID,
    "clientSecret" : process.env.GITHUB_DEV_SECRET,
    "callbackURL"  : process.env.GITHUB_DEV_CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
    
        var searchQuery = {
            "gh_name" : profile.displayName
        };
    
        var updates = {
            "gh_name"         : profile.displayName,
            "gh_id"           : profile.id,
            "gh_login"        : profile._json.login,
            "gh_avatar_url"   : profile._json.avatar_url,
            "gh_bio"          : profile._json.bio,
            "display_name"    : profile.displayName
        };

        var options = {
            "upsert" : true
        };
    
        // update the user if exists or add a new user
        User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
            if(err) {
                return done(err);
            } else {
                return done(null, user);
            }
        });
    }

));

// serialize user into the session
init();

module.exports = passport;
