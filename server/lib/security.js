var express = require('express');
var app = express();
var passport = require('passport');
var crypto = require('crypto');
var async = require('async');
var config = require('../config.js');
var mailer = require('./mailer')(config);
var userMethods = require('./routes/api/strategy')(passport);

var security = {

  authenticationRequired: function(req, res, next) {
    console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401,userMethods.filterUser(req.user));
    }
  },

  getCurrentUser: function(req, res, next) {
      res.json(200,userMethods.filterUser(req.user));
      res.end();
  },

  authenticate:   function(req, res, next) {
      return passport.authenticate('local-login', function (err, user, info){
          if (err) { return next(err); }

          if (!user) { return res.json(userMethods.filterUser(user)); }

          console.log('authenticating '  );
          req.logIn(user, function(err) {
              if ( err ) { return next(err); }
              return res.json(userMethods.filterUser(user));
          });
      })(req, res, next);
  },

  login: function(req, res, next){
    return security.authenticate(req, res, next);
  },

  logout: function(req, res, next) {
      req.logout();

      return res.redirect('/home');
  },

  register: function(req, res, next) {
      console.log("server.security.register");
      console.log(req.body);
      console.log('Creating new user...');

      var user = req.body;
      userMethods.findByEmail(user.email, function(err, existingUser) {
          if(err){
              console.log('Error: ' + err.message);
              return next(err);
          }
          if ( existingUser){
              var message = 'Account with that email address already exists.';
              console.log(message);
              return next({message: message}, null);
          }
          else{
              console.log('Creating new user...');
              userMethods.saveUser(true, user, function(err, newUser) {
                  if(err){
                      var message = 'Error creating new user';
                      return next(err, null);
                  }
                  else{
                      console.log('Created new user...');
                      console.log(newUser);
                   //   mailer.sendWelcomeEmail(newUser);

                      return res.json(200,userMethods.filterUser(newUser));
                  }
              });
          }
      });
  },

  recoverPassword: function(req, res, next) {
      async.waterfall(
          [
              function (done) {
                  crypto.randomBytes(16, function (err, buf) {
                      var token = buf.toString('hex');
                      console.log("done:" + token);
                      done(err, token);
                  });
              },

              function (token, done) {
                  var email = req.body.email && req.body.email != null ? req.body.email : '';
                  console.log(email);
                  userMethods.query({ q: JSON.stringify({email: email.toLowerCase()}) }, function (err, result) {
                      console.log("query");
                      if (err) {
                          done(err);
                      }

                      if (result && result.length === 1) {
                          var user = result[0];
                          console.log("user");
                          user.resetPasswordToken = token;
                          user.resetPasswordExpires = Date.now() + 3600000 * 24; // 24 hours

                          userMethods.saveUser(false, user, function (err, user) {
                              if (err) {
                                  console.log("We encounter an error updating user's info");
                                  done("We encounter an error updating user's info");
                              }
                              else {
                                  console.log('updated user...');
                                  console.log(user);
                                  done(null, user);
                              }
                          });
                      }
                      else {
                          done("There is no user with this email address");
                      }
                  });
              },

              function (user, done) {
                  var email = user.email;
                  mailer.sendResetPasswordEmail(email, function (err) {
                      if (err) {
                          done('We encounter an error sending the email');
                          console.log(err);
                      }
                      else {
                          console.log('An e-mail has been sent to ' + email + ' with further instructions.');
                          done({success: true, message: 'An e-mail has been sent to ' + email + ' with further instructions.'});
                      }
                  });
              }
          ],

          function (err) {
              console.log(" catch error: " + err);
              if (err)
                  return next({status: err});
          }
      );
  }
};

module.exports = security;