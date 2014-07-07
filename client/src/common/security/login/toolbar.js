angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['security', function(security) {
  var directive = {
    templateUrl: '/security/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {

        $scope.isAuthenticated = security.isAuthenticated;
        $scope.getUserEmail = security.getCurrentUserEmail;

        $scope.openLogin = function () {
            security.openLogin(true);
        };

        $scope.openSignup = function () {
            security.openLogin(false);
        };

        $scope.logout = function(){
            security.logout('/',
                function(){
                    $scope.$emit("UPDATE_LOGIN_STATE",   security.isAuthenticated() );
                },
                function(erorr){

                });
        };
    }
  };
  return directive;
}]);