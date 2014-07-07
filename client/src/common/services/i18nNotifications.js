angular.module('services.i18nNotifications', ['services.notifications', 'services.localizedMessages'])
.factory('i18nNotifications', ['localizedMessages', 'notifications', function (localizedMessages, notifications) {

    var prepareNotification = function(error, msgKey, type, interpolateParams, otherProperties) {
        return angular.extend({
            message: error != null ? localizedMessages.getFromError(error, msgKey, interpolateParams) : localizedMessages.get(msgKey, interpolateParams),
            type: type
        }, otherProperties);
    };

    var I18nNotifications = {
        pushSticky:function (error, msgKey, type, interpolateParams, otherProperties) {
            return notifications.pushSticky(prepareNotification(error, msgKey, type, interpolateParams, otherProperties));
        },
        pushForCurrentRoute:function (error, msgKey, type, interpolateParams, otherProperties) {
            return notifications.pushForCurrentRoute(prepareNotification(error, msgKey, type, interpolateParams, otherProperties));
        },
        pushForNextRoute:function (error, msgKey, type, interpolateParams, otherProperties) {
            return notifications.pushForNextRoute(prepareNotification(error, msgKey, type, interpolateParams, otherProperties));
        },
        getCurrent:function () {
            return notifications.getCurrent();
        },
        remove:function (notification) {
            return notifications.remove(notification);
        }
    };

    return I18nNotifications;
}]);