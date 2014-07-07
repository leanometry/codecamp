angular.module('home', [
    'security.authorization'
] )

    .config(['$routeProvider', 'securityAuthorizationProvider',  function ($routeProvider, securityAuthorizationProvider) {
        $routeProvider.when('/', {
            bodyClass: 'home',
            title: 'ContactsApp',
            templateUrl:'/home/home.tpl.html',
            controller:'HomeController',
            resolve:{
                currentUser: securityAuthorizationProvider.requireAuthenticatedUser
            }
        });
    }])

    .controller('HomeController', ['$scope', '$location', 'API_CONFIGS', 'currentUser', 'security', function ($scope, $location, API_CONFIGS, currentUser, security) {
        if(currentUser != null)
            $location.path('/dashboard');

        $scope.imgPaths = API_CONFIGS().server.imgPaths;
        $scope.userId = currentUser != null ?  currentUser.id : 0;

        $scope.getStarted = function () {
            security.openLogin(true);
        };
    }]);