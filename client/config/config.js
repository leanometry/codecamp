angular.module('configs', [])
.constant('API_CONFIGS', (function(){
    var constants = angular.fromJson('@@constants');
    return constants;
}));