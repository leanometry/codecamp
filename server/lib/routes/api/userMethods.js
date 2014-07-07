
var rest = require('request');
var bcrypt = require('bcrypt-nodejs');
module.exports = function(config) {
    var mongo = config.database.mongo;
    var usersCollection = config.database.usersCollection;
    var userMethods = {
        baseUrl : mongo.apiUrl + '/' + mongo.dbName + '/collections/' + usersCollection + '/',
        apiKey : mongo.apiKey,

        filterUser : function(user) {
            if ( user && user._id) {
                return {
                    user : {
                        id: user._id ? user._id.$oid : 0,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                };
            } else {
                return { user: null };
            }
        },
        // Encrypt password
        encryptedPassword : function(password) {
            if(password)
                return password;// bcrypt.hashSync(password, bcrypt.genSaltSync(5) );
            return null;
        },

        // compare passwords
        comparePasswords : function(password, candidatePassword) {
            return candidatePassword == password //bcrypt.compareSync(candidatePassword, password )
        } ,

        // Get a user by id
        getById : function(id, done) {
            var query = { apiKey: userMethods.apiKey };
            return rest.get(userMethods.baseUrl + id, { qs: query, json: {} }, function(err, response, body) {
                done(err, body);
            });
        },

        // Query the users collection
        query : function(query, done) {
            query.apiKey = userMethods.apiKey;     // Add the apiKey to the passed in query
            return rest.get(userMethods.baseUrl, { qs: query, json: {} }, function(err, response, body) {
                done(err, body);
            });
        },

        // Find a user by their email
        findByEmail : function(email, done) {
            return userMethods.query({ q: JSON.stringify({email: email}) }, function (err, result) {
                if (result && result.length === 1) {
                    return done(err, result[0]);
                }
                return done(err, null);
            })
        },

        // Check whether the user passed in is a valid one
        verifyUser : function(email, password, done) {
            return userMethods.findByEmail(email, function(err, user) {
                if (!err && user) {

                    console.log('User EncryptedPassword: ' + user.password + '; Sent Password: ' + password + '; Sent EncryptedPassword' + userMethods.encryptedPassword(password));
                    if (user.password != userMethods.encryptedPassword(password)) {
                        err = {message: 'Invalid password'};
                        user = null;
                    }
                }
                return done(err, user);
            });
        },

        // create a user
        saveUser : function(isNew , user, done) {
            var query = { apiKey: userMethods.apiKey };
            console.log('On Save: User UnEncryptedPassword: ' + user.password + '; User EncryptedPassword: ' + userMethods.encryptedPassword(user.password));

            if(isNew){
                user.password = userMethods.encryptedPassword(user.password);
            }

            return rest.post(userMethods.baseUrl, { qs: query, json: user }, function(err, response, body) {
                done(err, body);
            });
        }
    };
    return userMethods;
};