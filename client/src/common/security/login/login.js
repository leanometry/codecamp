angular.module('security.login',
[
    'security.login.toolbar',
    'directives.submit',
    'directives.uniqueEmail'
])
.controller('LoginController', ['$scope', 'security', 'localizedMessages', function($scope, security, localizedMessages) {

        $scope.allforms = {login : 1, signup: 2, forgotPassword: 3};

        $scope.whichForm = security.isLogin ? 1 : 2;

        // Show the modal   dialog
        $scope.load = function (form) {
            $scope.whichForm = form;
            $scope.clearForm();
        };

        // The model for this form
        $scope.user = {};
        $scope.password = $scope.user.password;

        // Any error message from failing to login
        $scope.authError = null;
        $scope.errorReason = '';

        // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
        // We could do something different for each reason here but to keep it simple...
        $scope.authReason = null;
        if ( security.getLoginReason() ) {
            $scope.authReason = ( security.isAuthenticated() ) ?
                localizedMessages.get('login.reason.notAuthorized') :
                localizedMessages.get('login.reason.notAuthenticated');
        }

        $scope.clearForm = function() {
            $scope.user = {};
            $scope.password =null
        };

        // -------------
        $scope.close =  security.closeLogin;
        $scope.onsuccesslogin = function(isAuthenticated) {
            var isAuthenticated = security.isAuthenticated();
            if (isAuthenticated) {
                $scope.$emit("UPDATE_LOGIN_STATE", isAuthenticated);
                if (security.hasPopup === true) {
                    security.closeLogin();
                    security.redirect();
                } else {
                    $scope.onInnerSuccessLogin({userId: security.getCurrentUserId()});
                    security.redirect('/dashboard');
                }
            }
            else{
                $scope.authError = localizedMessages.getFromError(null, 'login.error.notUser');
            }
        };

        // Attempt to authenticate the user specified in the form's model
        $scope.login = function() {
            // Clear any previous security errors
            $scope.authError = null;
            $scope.authReason = null;

            // Try to login
            security.login($scope.user.email, $scope.user.password,
                $scope.onsuccesslogin,
                function (error) {
                    var mes = error && error.data && error.data.error ? error.data.error : null;
                    $scope.authError = localizedMessages.getFromError(mes, 'login.error.invalidCredentials');
                }
            );
        };

        // Attempt to register the user specified in the form's model
        $scope.register = function() {
            // Clear any previous security errors
            $scope.authError = null;

            security.register($scope.user,
                function(newUser) {
                    if (newUser ) {
                        $scope.onsuccesslogin(newUser);
                    }
                },function (error) {
                    var mes = error && error.data && error.data.error ? error.data.error : null;
                    $scope.errorReason = localizedMessages.getFromError(mes, 'crud.user.register.error');
                }
            );
        };

        $scope.recoverPassword = function() {
            security.recoverPassword($scope.user.email,
                function (result) {
                    $scope.recoverMessage = localizedMessages.getFromError(null, 'reset_password.success');
                },
                function (error) {
                    var mes = error && error.data && error.data.error ? error.data.error : null;
                    $scope.recoverError = localizedMessages.getFromError(mes, 'reset_password.error');
                }
            );
        };

    }]);
