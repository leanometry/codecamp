angular.module('services.localizedMessages', [])
    .factory('localizedMessages', ['$interpolate', 'I18N.MESSAGES', function ($interpolate, i18nmessages) {

    var handleNotFound = function (msg, msgKey) {
        return msg || '?' + msgKey + '?';
    };

    var messages =  {
        get : function (msgKey, interpolateParams) {
            var msg =  i18nmessages[msgKey];
            if (msg) {
                return $interpolate(msg)(interpolateParams);
            } else {
                return handleNotFound(msg, msgKey);
            }
        },

        getFromError : function (error, msgKey, interpolateParams) {
            var message = messages.get(msgKey, interpolateParams);
            if(error){
                if(error.fieldValidationMessages != null  ){
                    message = '';
                    for(var field in error.fieldValidationMessages){
                        message += error.fieldValidationMessages[field] + '; ' ;
                    }
                    if(message.length > 0){
                        message = message.substring(0, message.length-2);
                    }
                } else if(error.message != null){
                    message +=  ': ' + error.message ;
                }
            }
            return message;
        }
    };
    return messages;
}]);