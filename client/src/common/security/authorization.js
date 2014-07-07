angular.module('security.authorization', ['security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
.provider('securityAuthorization', {
    requireAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
        return securityAuthorization.requireAuthenticatedUser();
    }],

    hasAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
        return securityAuthorization.hasAuthenticatedUser();
    }],

    $get: ['security', 'securityRetryQueue', '$location', function(security, queue, $location) {
        var service = {
              // Require that there is an authenticated user
              // (use this in a route resolve to prevent non-authenticated users from entering that route)
              onError: function(newPath){
                  window.location.href =newPath ? newPath : '/';
                  //return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
              } ,

            hasAuthenticatedUser : function ( ){
                  return security.requestCurrentUser().then(
                      function (userInfo) {
                          if ( security.isAuthenticated() ) {
                              return security.getCurrentUser();
                          }
                          else {
                              return null;
                          }
                      },

                      function (error, status, headers, config) {
                          return null;
                      }
                  );
              }  ,

              requireAuthenticatedUser: function(newPath) {
                  return security.requestCurrentUser().then(
                      function (userInfo) {
                          if (!security.isAuthenticated() && $location.path() != '/') {
                              return service.onError();
                          }
                          else {
                              return security.getCurrentUser();
                          }
                      },

                      function (error, status, headers, config) {
                          if ($location.path() != '/') {
                              return service.onError(newPath);
                          }
                      }
                  );
              }
        };

        return service;
    }]
});