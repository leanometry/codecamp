path = require('path');

var environment =  process.env.NODE_ENV || 'development';

var config = {
    development: {

        appName: 'CodeCampApp Dev',
        companyName: 'CodeCampApp LLC',

        staticPath:"/static",
        imagesPath:"/static/img/",
        dataApi:{
            path: '/api',
            currentUserPath:'/currentUser/api'
        },
        database: {
            usersCollection : 'users',

            mongo: {
                dbName:'codecamp',
                apiUrl: 'https://api.mongolab.com/api/1/databases',            // The base url of the MongoLab DB server
                apiKey: '31Bt2CISWs8z9eEKUtpM3lwhVCgOq8Yf'                 // Our MongoLab API key
            }
        },

        server:{
            listenURL: 'localhost',
            listenPort: 3337,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
            securePort: 8436,                                   // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
            distFolder: path.resolve(__dirname, '../client/dist'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
            staticUrl: '/static',                               // The base url from which we serve static files (such as js, css and images)
            cookieSecret: 'codecamp-dev-app',                         // The secret for encrypting the cookie

            appPath:  path.resolve(__dirname, '.')
        },

        mailer:{
            bcc: 'symonny@gmail.com',
            smtp:{ // sending mail throught gmail
                from: 'codecamp@localhost.com',  // mail for sender
                host: 'smtp.gmail.com', // hostname
                secureConnection: true, // use SSL
                port: 465, // port for secure SMTP
                auth: {
                    user: ' ', // username for sender
                    pass: '' // password for sender
                }
            },
            templatePath: "./views/emails/" //path to the email templates
        }
    },

    production: {

        appName: 'CodeCampApp',
        companyName: 'CodeCampApp LLC',

        staticPath:"/static",
        imagesPath:"/static/img/",
        dataApi:{
            path: '/api',
            currentUserPath:'/currentUser/api'
        },
        database: {
            usersCollection : 'users',


            mongo: {
                dbName:'codecamp-prod',
                apiUrl: 'https://api.mongolab.com/api/1/databases',            // The base url of the MongoLab DB server
                apiKey: '31Bt2CISWs8z9eEKUtpM3lwhVCgOq8Yf'                 // Our MongoLab API key
            }
        },

        server:{
            listenURL: 'codecamp.leanometry.com',
            listenPort: 8080,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
            securePort: 8436,                                   // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
            distFolder: path.resolve(__dirname, '../client/dist'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
            staticUrl: '/static',                               // The base url from which we serve static files (such as js, css and images)
            cookieSecret: 'codecamp-app'                         // The secret for encrypting the cookie
        },
        mailer:{
            bcc: 'symonny@gmail.com',
            smtp:{ // sending mail throught gmail
                from: 'codecamp@localhost.com',  // mail for sender
                host: 'smtp.gmail.com', // hostname
                secureConnection: true, // use SSL
                port: 465, // port for secure SMTP
                auth: {
                    user: ' ', // username for sender
                    pass: '' // password for sender
                }
            },
            templatePath: "./views/emails/" //path to the email templates
        }
    }
};

module.exports = config[environment];