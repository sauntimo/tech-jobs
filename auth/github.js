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
            "name": profile.displayName
        };
    
        var updates = {
            "name": profile.displayName,
            "id": profile.id
        };
    
        var options = {
            "upsert": true
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
