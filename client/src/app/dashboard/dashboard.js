angular.module('dashboard',
    [
    'security.authorization',
        'contacts'
])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {

$routeProvider.when('/dashboard', {
    bodyClass: 'dashboard',
    title: 'My Contacts',
    templateUrl:'/dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl',
    resolve:{
        currentUser: securityAuthorizationProvider.requireAuthenticatedUser,
        contacts:['Contacts', function (Contacts) {
            return Contacts.query(Contacts.IsForCurrentUser, {}, function(result){return result;}, function(result){return result;});
        }]
    }
  });
}])

.controller('DashboardCtrl', ['$scope', '$location', 'currentUser' ,'contacts',
        function ($scope, $location,  currentUser,contacts) {
            if(currentUser != null )

    console.log('DashboardCtrl');
    $scope.currentUser = currentUser;

            $scope.contacts = contacts;
}]);