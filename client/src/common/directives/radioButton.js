angular.module('directives.radioButton', [])

.directive('radioButton', ['$parse', function($parse) {
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
        template: '<div class="custom-radio">'+
            '<div class="radio-button">'+
            '<input type="radio" ng-model="ngModel" value="{{value}}" name="{{value}}" id="{{ngModelText}}{{value}}" ng-click="click" ng-checked="checked()" />'+
            '<label for="{{ngModelText}}{{value}}"><span class="radio-checked"></span></label>'+
            '</div>'+
            '<div class="title"><label for="{{value}}">{{label}}</label></div>'+
            '</div>',
        replace: true
    };
}]);
