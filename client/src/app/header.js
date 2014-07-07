
angular.module('app')
    .directive('appHeader', function() {
        return {
            restrict: 'E',
            replace: true ,

            scope: {
                isLoggedIn: '='
            },

            controller:'HeaderCtrl',
            templateUrl: '/header.tpl.html'
        };
    })

    .controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'breadcrumbs', 'notifications', 'httpRequestTracker','$timeout','API_CONFIGS',
    function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker, $timeout, API_CONFIGS ) {
        $scope.location = $location;
        $scope.breadcrumbs = breadcrumbs;
        $scope.isAuthenticated = security.isAuthenticated;
        $scope.imgPaths = API_CONFIGS().server.imgPaths;

        $scope.setIsLoggedIn = function (value){
            $timeout(function() {
                $scope.$apply(function () {
                    $scope.isLoggedIn = value;
                });
            });
        };
        $scope.setIsLoggedIn(security.isAuthenticated());


        $scope.$on('UPDATE_LOGIN_STATE', function (event, isLoggedIn) {
            $scope.setIsLoggedIn(isLoggedIn);
        });

        $scope.home = function () {
            if (security.isAuthenticated()) {
                $location.path('/dashboard');
            } else {
                $location.path('/');
            }
        };

        $scope.isNavbarActive = function (navBarPath) {
            return navBarPath === breadcrumbs.getFirst().name;
        };

        $scope.hasPendingRequests = function () {
            return httpRequestTracker.hasPendingRequests();
        };

    }]) ;