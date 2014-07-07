//based on angular-dropdowns module by http://github.com/jseppi

angular.module('directives.dropdowns', []).directive('dropdownSelect', [
    '$document', function($document) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                dropdownSelect: '=',
                dropdownModel: '=',
                dropdownOnchange: '&'
            },
            controller: [
                '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                    var body;
                    $scope.labelField = $attrs.dropdownItemLabel != null ? $attrs.dropdownItemLabel : 'text';

                    $scope.select = function(selected) {
                        if (selected !== $scope.dropdownModel) {
                            $scope.dropdownModel = selected;
                        }
                        $scope.dropdownOnchange({
                            selected: selected
                        });
                    };

                    body = $document.find("body");

                    body.bind("click", function() {
                        $element.removeClass('active');
                    });

                    $element.bind('click', function(event) {
                        event.stopPropagation();
                        $element.toggleClass('active');
                    });
                    $scope.$watch('dropdownModel', function(){});
                }
            ],
            template: "<div class='wrap-dd-select'>"+
                "<span class='selected'>{{dropdownModel[labelField]}}</span>"+
                    "<ul class='dropdown'>"+
                    "<li ng-repeat='item in dropdownSelect' class='dropdown-item'>"+
                        "<a href='' class='dropdown-item'  ng-click='select(item)'>"+
                            "{{item[labelField]}}"+
                        "</a>"+
                    "</li>"+
                    "</ul>"+
                "</div>"
        };
    }
]);