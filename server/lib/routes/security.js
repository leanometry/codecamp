exports.addRoutes = function(app, config, security) {
    app.post( '/login', security.login);

    // update profile
    app.post( '/register', security.register);

    app.post( '/recoverPassword', security.recoverPassword);

    // Retrieve the current user only if they are authenticated
    app.get( '/getCurrentUser',  security.getCurrentUser );

    app.post( '/logout',function(req, res) {
        security.authenticationRequired(req, res, function() {
            security.logout(req, res);
        });
    });

};