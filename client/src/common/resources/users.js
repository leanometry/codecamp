angular.module('resources.users', ['apiResource'])

.factory('Users', ['apiResource', function (apiResource) {

    var user = apiResource('users');

    user.insertNewEmailUser = function(email, successcb, errorcb ) {
        return this.query({email:email},
            function (users) {
                if (users.length === 0) {
                    this.email = email;
                    user.prototype.$save({},successcb, errorcb);
                } else {
                    successcb( users[0]);
                }
            },errorcb
        );
    };

    user.getByEmail = function(email, successcb, errorcb ) {
        return this.query({email:email}, successcb ,errorcb );
    };

    return user;

        //generate short code - double check against database
        //fileId, userId, name, path, shortCode
        //create page for download

}]);
