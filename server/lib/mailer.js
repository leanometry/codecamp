
var nodemailer = require("nodemailer");
var fs      = require("fs");
var _       = require("underscore");

module.exports = function(config) {
    var mailerObj = {
        params:{
            templates: {
                headerTemplate : "_header",
                footerTemplate : "_footer"
            },

            general: {
                appName: config.appName,
                appUrl: 'http://' + config.server.listenURL +"/" ,
                imagesPath : config.imagesPath,
                companyName:config.companyName
            },

            // Define attachments here
            attachments: [{
                fileName: "logo.png",
                filePath: "./public/images/email/logo.png",
                cid: "logo@myapp"
            }]
        },

        constructor: function(newOptions, newData){
            $.extend( true, options, newOptions );
            $.extend( true, data, newData );
        },
    /*var options = {
     to:{
     email: "symonny@gmail.com",
     firstName:'',
     lastName:''
     },
     subject: "Reset Password",
     template: "reset-password"
     };
     */
        send: function(options, callback){
            var newdata = this.params;
            newdata.custom = options;
            var header = this.getHtml(newdata.templates.headerTemplate, newdata ) ,
                footer = this.getHtml(newdata.templates.footerTemplate, newdata),
                body = this.getHtml(newdata.custom.template, newdata);
            var html = header +" " + body + " " + footer;
            var attachments = [];//mailer.getAttachments(html),
                messageData = {
                    to: newdata.custom.to.firstName +" "+ newdata.custom.to.lastName +" <" + newdata.custom.to.email + ">",
                    cc: config.mailer.cc,
                    from: newdata.general.appName,
                    subject: newdata.custom.subject,
                    html: html,
                    generateTextFromHTML: true,
                    attachments: attachments
                };
            var transport = this.getTransport();
            transport.sendMail (messageData, callback);
        },

        getTransport: function(){
            return nodemailer.createTransport("SMTP", config.mailer.smtp);
        },

        getHtml: function(templateName, data){
            var templatePath = config.mailer.templatePath + templateName + ".html";
            console.log(templatePath);
           var templateContent = fs.readFileSync(templatePath, encoding="utf8")
            return _.template(templateContent, data, {interpolate: /\{\{(.+?)\}\}/g});
        },

        getAttachments: function(html){
            var attachments = [];

            $.each(this.attachments, function( index, attachment ) {
                if(html.search("cid:#{attachment.cid}") > -1){
                    attachments.push(attachment);
                }
            });

            return attachments;
        },

        sendWelcomeEmail: function (newUser, callback){
            var options = {
                to:{
                    email: newUser.email ,
                    name: newUser.firstName + " " + newUser.lastName
                },
                subject: "Welcome to "+ config.appName ,
                template: "welcome",
                username: newUser.login,
                password: newUser.password,
                firstName: newUser.firstName
            };
            return this.send(options,callback);
        },

        sendNewProductEmail: function (currentUser, newConf,callback){
            var options = {
                to:{
                    email: currentUser.email ,
                    name: currentUser.firstName + " " + currentUser.lastName
                },
                subject: "New Event Created in "+ config.appName ,
                template: "new-product",
                eventName: newConf.eventName,
                eventDate: newConf.eventDate
            };
            return this.send(options,callback);
        },

        sendResetPasswordEmail: function (email, resetLink, callback){
            var options = {
                to:{
                    email: email
                },
                subject: "Reset Password",
                template: "reset-password",
                resetLink: resetLink
            };
            return this.send(options,callback);
        }
    };

    return mailerObj;
};