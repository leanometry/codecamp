// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
    'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
    'security.login'          // Contains the login form template and controller
])
    .factory('security', [   '$http', '$q', '$location', 'securityRetryQueue', '$modal',
        function( $http, $q, $location, securityRetryQueue, $modal) {

        // Register a handler for when an item is added to the retry queue
        securityRetryQueue.onItemAddedCallbacks.push(function(retryItem) {
            if ( securityRetryQueue.hasMore() ) {
                service.openLogin(true);
            }
        });

        var modalInstance ;

        var openPopup = function (isLogin) {
            service.isLogin = isLogin;
            service.hasPopup = true;
            // Login form dialog stuff
            // Redirect to the given url (defaults to '/')
            modalInstance = $modal.open({
                backdrop: true,
                templateUrl: '/security/login/login.tpl.html',
                controller: 'LoginController',
                contentClass:'nopadding'
            });
            modalInstance.result.then(function (success) {
                if (success) {
                    securityRetryQueue.retryAll();
                    service.redirect();
                } else {
                    securityRetryQueue.cancelAll();
                    service.redirect();
                }
            });
        };

        var closePopup = function( ){
            modalInstance.dismiss('cancel');
        };

        // The public API of the service
        var service = {
            $files : null,
            isLogin : true,
            hasPopup : true,

            redirect : function (url, obj) {
                if(!url || url == null)
                    url = $location.$$url;
                if (url === '/' && service.isAuthenticated())
                    url = '/dashboard';
                $location.path(url);
            },

            redirectToUpload: function (url, obj) {
                if(obj && obj != null ) {
                    service.setSelectedUploadedFiles(obj);
                }

                $location.path('/dashboard');
            },

            getSelectedUploadedFiles: function() {
                return service.$files ? service.$files : null;
            },

            setSelectedUploadedFiles: function($files) {
                service.$files = $files ;
            },

            // Get the first reason for needing a login
            getLoginReason: function() {
                return securityRetryQueue.retryReason();
            },

            openLogin: function(isLogin){
                openPopup(isLogin);
            } ,

            closeLogin: function( ){
                closePopup( );
            } ,

            //----------------current user methods ----------------//

            // Information about the current user
            currentUser: null,

            getCurrentUser : function () {
                return   service.currentUser ? service.currentUser : null;
            },

            setCurrentUser: function (user) {
                service.currentUser = user ? user : null;
            },

            getCurrentUserId: function (user) {
                var user = service.getCurrentUser();
                return user != null ? user.id : 0;
            },

            getCurrentUserEmail : function () {
                var user =   service.getCurrentUser();
                return user != null ? user.email : '';
            },

            setCurrentUserEmail: function(email){
                if(email && email != ''){
                    service.email = email;
                }
            },

            // Is the current user authenticated?
            isAuthenticated: function(){
                return !!service.currentUser;
            },

            //----------------api calls  ---------//
            // Attempt to authenticate a user by the given email and password
            login: function(email, password, onsuccess, onerror, isNew) {
                return $http.post('/login', {email: email, password: password}).then(
                    function(response) {
                        var user = response.data && response.data.user ? response.data.user : null;
                        if(user!=null) {
                            service.setCurrentUser(user);
                            if (service.isAuthenticated()) {
                                onsuccess(user);
                            }
                        }
                        else{
                            onsuccess(service.isAuthenticated());
                        }
                    },
                    onerror
                );
            },

            // Attempt to register a user
            register: function(user, onsuccess, onerror) {
                return $http.post('/register', user).then(
                    function(response) {
                        var newuser = response.data && response.data.user ? response.data.user : null;
                        if(newuser!=null) {
                            return service.login(user.email, user.password, onsuccess, onerror, true);
                        }
                    },
                    onerror
                );
            },

            // Logout the current user and redirect
            logout: function(redirectTo, onsuccess, onerror) {
                $http.post('/logout').then(
                    function() {
                        service.setCurrentUser(null);
                        onsuccess();
                        //service.redirect(redirectTo);
                        window.location.href = redirectTo && redirectTo != null ? redirectTo : '/';
                    },
                    onerror
                );
            },

            // Ask the backend to see if a user is already authenticated - this may be from a previous session.
            requestCurrentUser: function(onsuccess, onerror) {
                if ( service.isAuthenticated() ) {
                    return $q.when(service.getCurrentUser());
                } else {
                    return $http.get('/getCurrentUser').then(
                        function(response) {
                            var user = response.data && response.data.user ? response.data.user : null;
                            service.setCurrentUser(user) ;

                            if(onsuccess && onsuccess != null){
                                onsuccess(service.isAuthenticated());
                            }

                            return service.getCurrentUser();
                        },
                        function(error){
                            return null;
                        }
                    );
                }
            },

            recoverPassword: function(email,onsuccess, onerror) {
                $http.post('/recoverPassword', {email: email}).then(onsuccess, onerror);
            }
        };

        return service;
    }]);
