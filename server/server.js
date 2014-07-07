var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(__dirname + '/cert/certificate.pem').toString();
var credentials = {key: privateKey, cert: certificate};
var staticAsset = require('static-asset');

var express = require('express');
//var expressValidator = require('express-validator');
var config = require('./config.js');
var passport = require('passport');
var passportProvider = require('./lib/passportProvider');
var xsrf = require('./lib/xsrf');
var protectJSON = require('./lib/protectJSON');
require('express-namespace');

var app = express();
var secureServer = https.createServer(credentials, app);
var server = http.createServer(app);
app.use(staticAsset(__dirname + config.server.staticUrl) );

require('./lib/routes/static').addRoutes(app, config);

app.use(protectJSON);

app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method


app.use(express.methodOverride());
app.use(express.cookieParser(config.server.cookieSecret));  // Hash cookies with this secret
app.use(express.cookieSession());                           // Store the session in the (secret) cookie
app.use(passport.initialize());                             // Initialize PassportJS
app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
app.use(xsrf);                                              // Add XSRF checks to the request
app.disable('x-powered-by');

var security = require('./lib/security');
/*
app.use(function(req, res, next) {
  if ( req.user ) {
    console.log('Current User:', req.user.firstName, req.user.lastName);
  } else {
    console.log('Unauthenticated');
  }
  next();
});
*/

//require('./lib/routes/api/' + (config.database.isLocalDb ? 'local' : 'mongo') + '/api').addRoutes(app, config, security);

var allowCrossDomain = function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader( 'X-Powered-By', 'Leanometry LLC' );
    next();
};
app.use(allowCrossDomain);

var proxy = require('./lib/routes/api/proxy') ;

app.namespace(config.dataApi.path + '/:collection*', function() {
    app.all('/', function(req, res, next) {
         // We require the user is authenticated to modify any collections
        // security.authenticationRequired(req, res, next);
        next();
    });
    app.all('/',proxy(config, false));
});
app.namespace(config.dataApi.currentUserPath + '/:collection*', function() {
    app.all('/', function(req, res, next) {
        // We require the user is authenticated to modify any collections
       // security.authenticationRequired(req, res, next);
        next();
    });
    app.all('/',proxy(config, true));
});

require('./lib/routes/security').addRoutes(app, config, security);

require('./lib/routes/appFile').addRoutes(app, config);

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));



if(process.env.NODE_ENV == 'production'){
    // Start up the server on the port specified in the config
    server.listen(config.server.listenPort );
    console.log( "running on production");
}
else{
    // Start up the server on the port specified in the config
    server.listen(config.server.listenPort, config.server.listenURL, 511, function() {
        // // Once the server is listening we automatically open up a browser
        var open = require('open');
        open( config.server.listenURL + config.server.listenPort + '/');
    });
    console.log( config.appName + "App Server - listening at: http://" + config.server.listenURL+ ":" + config.server.listenPort);
    secureServer.listen(config.server.securePort);
    console.log( config.appName + "App Server - securely listening at: https://" + config.server.listenURL+ ":" + config.server.securePort);
}

