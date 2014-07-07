angular.module('app', [
    'configs',
    'constants',
    'ngRoute',
    'ngAnimate',
    'angular-loading-bar',
    'xeditable',

  'services.breadcrumbs',
  'services.i18nNotifications',
  'services.httpRequestTracker',
  'security',
  'directives.crud',
  'templates.app',
  'templates.common',
   'ui.bootstrap',

    'directives.radioButton',
    'directives.checkboxButton',
    'directives.dropdowns',

    //additional modules
    'home',
    'dashboard'
]);

// add cors support
angular.module('app').config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

angular.module('app').config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
   // cfpLoadingBarProvider.includeBar = false;
}]);

angular.module('app').config(['$routeProvider', '$locationProvider' ,
    function ($routeProvider, $locationProvider) {
     $locationProvider.html5Mode(true);

     $routeProvider
        .otherwise({
            redirectTo:'/'
        });
}]);

angular.module('app').run(['$rootScope', 'security', function($rootScope, security) {
    // Get the current user when the application starts
    // (in case they are still logged in from a previous session)
    //security.requestCurrentUser();

    $rootScope.$on('$routeChangeSuccess', function(ev, current, previous) {
        var routes = current.$$route;
        if (routes && routes.controller){
            $rootScope.controller = routes.controller ? routes.controller : '';
            $rootScope.title = routes.title ?  routes.title   : 'ContactsApp';
            $rootScope.bodyClass = routes.bodyClass ? routes.bodyClass : '';
        }
    });
}]);

angular.module('app').run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

angular.module('app').controller('AppCtrl', ['API_CONFIGS', '$scope', 'i18nNotifications',
    function(API_CONFIGS, $scope, i18nNotifications) {
  $scope.isLoggedIn = false;
  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(product, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });

}]);