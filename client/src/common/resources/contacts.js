angular.module('resources.Contacts', ['apiResource'])

.factory('Contacts', ['apiResource', function (apiResource) {
    var Contacts = apiResource('contacts');
    Contacts.types = [
        {value: 'Home', text: 'Home'},
        {value: 'Cell', text: 'Cell'}
    ];

    Contacts.getTypes = function (){
        return Contacts.types
    };

        Contacts.prototype.getFullName = function () {
        return this.lastName + " " + this.firstName;
    };

    return Contacts;
}]);
