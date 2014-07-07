angular.module('directives.submit', [])

.directive('submit', ['$parse', function($parse) {
    return {
        // We ask this directive to create a new child scope so that when we add helper methods to the scope
        // it doesn't make a mess of the parent scope.
        // - Be aware that if you write to the scope from within the form then you must remember that there is a child scope at the point
        scope: true,
        // We need access to a form so we require a FormController from this element or a parent element
        require: '^form',
        // This directive can only appear as an attribute
        link: function(scope, element, attrs, form) {

            scope.getCssClasses = function(fieldName) {
                var field = form[fieldName];
                return {
                    error: field.$invalid && field.$dirty,
                    success: field.$valid && field.$dirty
                };
            };

            scope.showError = function(fieldName, error) {
                var field = form[fieldName];
                return field.$error[error] && field.$dirty;
            };

//make sure to set the name and id for the form to be the same

            var formid = '#' + form.$name;
            $(document).on('submit', formid, function(){
               var form1 = scope[attrs.name];
                if (!form1.$valid){return false;}

                angular.forEach(form1, function(field, name) {
                    if (typeof(name) === 'string' && !name.match('^[\$]') && field.$pristine) {
                        $timeout(function() {
                             scope.$apply(function () {
                                field.$setViewValue(field.$viewValue);
                            });
                        });
                    }
                });

                if (form1.$valid){ scope.$apply(attrs.submit);}
            });
        }
    };
}]);
