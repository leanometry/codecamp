angular.module('contacts', [
    'security.authorization',
    'resources.Contacts'
])

.directive('contactsList', function() {
    return {
        restrict: 'E',
        replace: true,

        scope: {
            contacts: '='
        },

        controller:'ContactsCtrl',
        templateUrl: '/contacts/contacts.tpl.html'
    };
})

.controller('ContactsCtrl', ['$scope',  '$filter', '$location','i18nNotifications', 'Contacts', '$modal','security',
    function($scope, $filter, $location, i18nNotifications, Contacts, $modal, security) {

    console.log('ContactsCtrl');
    $scope.types =  Contacts.getTypes();

    $scope.$watchCollection('contacts', function( ) {
        $scope.hasContacts = function(){
            return $scope.contacts.length > 0;
        }
    }, true);

    $scope.hover = new Array($scope.contacts.length);
    $scope.$watchCollection('hover', function( ) {  }, true);


    $scope.showType = function(contact) {
        var selected = [];
        if(contact.type) {
            selected = $filter('filter')($scope.types, {value: contact.type});
        }
        return selected.length ? selected[0].text : null;
    };

    $scope.showLastName = function(contact) {
        return contact.lastName && contact.lastName != null ? contact.lastName : '';
    };

    $scope.checkFirstName = function(data) {
        if (!data || data == null || data === '') {
            return "Enter first name";
        }
    };

    $scope.checkLastName = function(data) {
        if (!data || data == null || data === '') {
            return "Enter last name";
        }
    };

    $scope.checkType = function(data) {
        if (!data || data == null || data === '') {
            return "Select type";
        }
    };

    $scope.checkEmailAddress = function(data) {
        if (!data || data == null || data === '') {
            return "Enter email address";
        }
    };


    $scope.onSave = function(contact) {
        $scope.refresh();
        var contacts = $filter('filter')($scope.contacts, {$$hashKey:$scope.currentContactInfo.$$hashKey});
        if(contacts && contacts.length>0) {
            contacts[0]._id = contact._id;
        }

        i18nNotifications.pushForCurrentRoute (null, 'crud.contacts.successUpdate', 'success', {name: contact.getFullName()});

        $scope.currentContactInfo = null;
    };

    $scope.onError = function(error, status, headers, config) {
        i18nNotifications.pushForCurrentRoute (error, 'crud.contacts.errorUpdate', 'error', {});
        $scope.currentContactInfo.rowform.$show();
        $scope.currentContactInfo = null;
    };

    $scope.checkPhoneNo = function( ){
            //to do validate phone number
    };

    $scope.currentContactInfo = null;

    $scope.saveContact = function(contact, rowform) {
        $scope.currentContactInfo = {rowform: rowform, $$hashKey: contact.$$hashKey} ;
        var data = rowform.$data;
        contact.firstName = data.firstName,
        contact.lastName = data.lastName,
        contact.emailAddress = data.emailAddress,
        contact.type = data.type

        if(data.phoneNo){
            contact.phoneNo = data.phoneNo;
        }
        contact.$saveOrUpdate($scope.onSave, $scope.onSave, $scope.onError, $scope.onError);
    };

    $scope.removeContactFromInterface = function(index){
        $scope.contacts.splice(index, 1);
        $scope.hover.splice(index,1);
    };

    $scope.removeContact = function(contact, index) {
        if(!contact.userId  ){
            $scope.removeContactFromInterface(index);
        }
        else{
            var modalInstance = $modal.open({
                templateUrl: '/contacts/confirm-remove.tpl.html',
                controller: 'ConfirmContactDeleteCtrl',
                resolve: {
                    contact: function () {
                        return contact;
                    }
                }
            });

            modalInstance.result.then(function () {
                i18nNotifications.pushForCurrentRoute (null, 'crud.contacts.removeSuccess', 'success', {}, {name: contact.firstName });
                $scope.removeContactFromInterface(index);
            }, function () {

            });
        }
    };

    $scope.addContact = function() {
        $scope.inserted = new Contacts({
            firstName: null,
            lastName: null,
            phoneNo: null,
            emailAddress: null,
            type: null,
            userId: security.getCurrentUserId()
        });
        $scope.contacts.push($scope.inserted);
        $scope.hover.push(false);
    };

    $scope.cancel = function ( contact, rowform, index) {
        if(!contact.userId) {
            $scope.removeContactFromInterface(index);
        }else{
            rowform.$cancel( );
        }
    };

    $scope.refresh = function(){
        $scope.error = '';
    };
}])

.controller('ConfirmContactDeleteCtrl', ['$scope',  '$modalInstance', 'contact','localizedMessages',
    function ($scope, $modalInstance, contact, localizedMessages) {
        console.log('ConfirmContactDeleteCtrl');

        $scope.name = contact.firstName;

        $scope.remove = function () {
            contact.$partialRemove(
                function(){
                    $modalInstance.close(true);
                },
                function(error, status, headers, config){
                    $scope.error = localizedMessages.getFromError(error, 'crud.contacts.errorDelete');
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);


