var LocalStrategy = require('passport-local').Strategy;
var config = require('../../../config.js');
var mailer = require('../../mailer')(config);

module.exports = function(passport ) {
    var userMethods = require('./userMethods')(config);

    // Serialize the user into a string (id) for storing in the session
    passport.serializeUser(function(user, done) {
        return done(null, user._id.$oid);
    });

    // Deserialize the user from a string (id) into a user (via a call to DB)
    passport.deserializeUser(function(id, done) {
        return userMethods.getById(id, done);
    });

    // Call the super constructor - passing in our user verification function
    // We use the email field for the username
    //LocalStrategy.call(this, { usernameField: 'email', passwordField : 'password' }, verifyUser.bind(this));
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true// allows us to pass back the entire request to the callback
    }, function(req, email, password, done) {
        return userMethods.verifyUser(email, password, done);
    } ));

    return userMethods;
}