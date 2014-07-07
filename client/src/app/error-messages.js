angular.module('constants', [])
.constant('I18N.MESSAGES', {
    'crud.user.load': 'Something went wrong when loading your account info',
    'crud.user.save.success':"Your account info was successfully updated",
    'crud.user.save.error':"Something went wrong when updating your account info",
    'crud.user.register.success':"Your account has been successfully created",
    'crud.user.register.error':"Something went wrong when creating your account",
    'crud.user.remove.success':"Your account was successfully deleted",
    'crud.user.remove.error':"Something went wrong when deleting your account",

    'crud.contacts.successUpdate': "Contact {{name}} has been successfully updated",
    'crud.contacts.errorUpdate': "Something went wrong when saving info for contact {{name}}",
    'crud.contacts.removeSuccess': "Contact {{name}} has been successfully removed",
    'crud.contacts.errorDelete': "Something went wrong when removing this contact",

    'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
    'login.reason.notAuthenticated':"You must be logged in to access this part of the application",
    'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again",
    'login.error.serverError': "Something went wrong when authenticating",
    'login.error.notUser':'A user with this email address does not exist'
});