angular.module('directives.checkboxButton', [])

.directive('checkboxButton', ['$parse', function($parse) {
    return {
        restrict: 'E',
        scope: {
            label: '@',
            ngModel: '=',
            ngModelText: '@ngModel',
            value: '@',
            click:'@'
        },
        controller: ['$scope', function ($scope)
        {
            $scope.checked = function()
            {
                return   !angular.isUndefined($scope.value) && !angular.isUndefined($scope.ngModel) ?
                    $scope.value.toString() === $scope.ngModel.toString() : false;
            };
        }],
        template: '<div class="custom-checkbox">'+
            '<div class="checkbox-button">'+
            '<input type="checkbox" ng-model="ngModel" value="{{value}}" name="{{value}}" id="{{ngModelText}}{{value}}" ng-click="click" ng-checked="checked()"/>'+
            '<label for="{{ngModelText}}{{value}}"><span class="checkbox-checked fontello circle-checked"></span></label>'+
            '</div>'+
            '<div class="title"><label for="{{value}}">{{label}}</label></div>'+
            '</div>',
        replace: true
    };
}]);
