CodeCampApp
========

# 1. Purpose

* An application that allows users to upload files that can be shared with audience.
* The viewer can download the file if he pays with a tweet/cash.

# 2. Stack

* Persistence store: [MongoDB Database](http://www.mongodb.org/)  
* Backend: [Node.js](http://nodejs.org/)
* [AngularJS](http://www.angularjs.org/) on the client
* CSS based on [Twitter's bootstrap 3.0 ](http://getbootstrap.com/)


# 3. Build

It is a complete project with a build system focused on AngularJS apps and tightly integrated with other tools commonly used in the AngularJS community:
* powered by [Grunt.js](http://gruntjs.com/)
* test written using [Jasmine](http://pivotal.github.com/jasmine/) syntax
* test are executed by [Karma Test Runner](http://karma-runner.github.io/0.8/index.html) (integrated with the Grunt.js build)
* build supporting JS, CSS and AngularJS templates minification
* [Twitter's bootstrap](http://getbootstrap.com/) with LESS templates processing integrated into the build

# 4. Installation

## 4.1 Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install Grunt-CLI and Karma as global npm modules:

    ```
    npm install -g grunt-cli karma
    ```

(Note that you may need to uninstall grunt 0.3 globally before installing grunt-cli)

## 4.2 Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

    ```
    git clone https://github.com/leanometry/codecamp.git
    cd codecamp
    ```

## 4.2 App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies (from the project root folder):

    ```
    cd server
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the server/package.json file)

## 4.3 Client App

Our client application is a straight HTML/Javascript application but our development process uses a Node.js build tool
[Grunt.js](gruntjs.com). Grunt relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies (from the project root folder):

    ```
    cd client
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the client/package.json file)

## 4.4 Building

### 4.4.1 Configure Server

Edit `server/config.js` to configure API, server, and mail server variables.
There are two sections in the file one for development configs and one for production configs.

#### API Configs

    ```
   dataApi:{
       path: '/api', //path to api routes
       currentUserPath:'/currentUser/api' // path to routes that verify current userId (i.e. contact for the current user)
   },
   database: {
       usersCollection : 'users', //table that contains the users

       mongo: {
           dbName:'codecamp',
           apiUrl: 'https://api.mongolab.com/api/1/databases',            // The base url of the MongoLab DB server
           apiKey: '31Bt2CISWs8z9eEKUtpM3lwhVCgOq8Yf'                 // replace MongoLab API key with your key
       }
   },
    ```

####  Server Configs

   ```
  server:{
        listenURL: 'localhost',
        listenPort: 3337,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
        securePort: 8436,                                   // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
        distFolder: path.resolve(__dirname, '../client/dist'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
        staticUrl: '/static',                               // The base url from which we serve static files (such as js, css and images)
        cookieSecret: 'codecamp-dev-app',                         // The secret for encrypting the cookie

        appPath:  path.resolve(__dirname, '.')
    },
   ```

####  Mail Server Configs

   ```
   mailer:{
         smtp:{ // sending mail throught gmail
             from: 'codecamp@localhost.com',  // mail for sender
             host: 'smtp.gmail.com', // hostname
             secureConnection: true, // use SSL
             port: 465, // port for secure SMTP
             auth: {
                 user: '', // username for sender
                 pass: '' // password for sender
             }
         },
         templatePath: "./views/emails/" //path to the email templates
   }
   ```

### 4.4.2 Configure Client
To configure the constants for client there are two files in client/config/environment:
 * development.json - configs for development environment
 * production.json - configs for production environment

 When using grunt to build the client a file with the configuration will be created in dist/js/config.js by replacing the variable @@contants from the filed client/config/config.js
 with the string from the json file for the specific environment.
 
   ```
   {
       "constants":{
             "appName":"Contacts", // app name
             "distdir":"dist", // path where the generated client code will be 
             "staticUrl":"/static", //url to static content  
             "server":{
                 "imgPaths": "/static/img/" //url to images
             },
        
             "dataApi": {
                 "path": "/api", //  url to api routes
                 "currentUserPath":"/currentUser/api", // url to api routes for current user 
                 "database": "codecamp", //database name as taken from mongolab 
             }
         }
   }
   ```

### 4.4.2 Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the Grunt build tool to do this.
* Build client application:

    ```
    cd client
    grunt build
    cd ..
    ```

*It is important to build again if you have changed the client configuration as above.*

## Running
### Start the Server
* Run the server

    ```
    cd server
    node server.js
    cd ..
    ```
* Browse to the application at [http://localhost:3336]
  
## Browser Support
We only regularly test against Chrome 29 and occasionally against Firefox and Internet Explorer.
The application should run on most modern browsers that are supported by the AngularJS framework.
Obviously, if you chose to base your application on this one, then you should ensure you do your own
testing against browsers that you need to support.

## Development

### Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `node_modules` contains build tasks for Grunt along with other, user-installed, Node packages
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies
* `vendor` contains external dependencies for the application
* `config` contains the json file for client side constants and the file config.js for configurations.

### Default Build
The default grunt task will build (checks the javascript (lint), runs the unit tests (test:unit) and builds distributable files) and run all unit tests: `grunt` (or `grunt.cmd` on Windows).  The tests are run by karma and need one or more browsers open to actually run the tests.
* `cd client`
* `grunt`
* Open one or more browsers and point them to [http://localhost:8080/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous Building
The watch grunt task will monitor the source files and run the default build task every time a file changes: `grunt watch`.

### Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `grunt build`.

### Building release code
You can build a release version of the app, with minified files.  This task will also run the "end to end" (e2e) tests.
The e2e tests require the server to be started and also one or more browsers open to run the tests.  (You can use the same browsers as for the unit tests.)
* `cd client`
* Run `grunt release`
* Open one or more browsers and point them to [http://localhost:8080/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous testing
You can have grunt (karma) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* `cd client`
* Run `grunt test-watch`.
* Open one or more browsers and point them to [http://localhost:8080/__test/].
* Each time a file changes the tests will be run against each browser.


### Debugging Node.js with Chrome

#### Installing

There is a very nice project that let you use the Chrome (read as Blink!) DevTools with a node module in order to have the powerful debugging options web developers got inside Chrome. Think on the ability to set a breakpoint and later going into functions and examine variables, objects on the fly. All you need to install is NodeJS (dah!) and since these days, NodeJS is coming with npm (=managing NodeJS modules) it’s one line of typing after you have node in order to install this module: node-inspector

    ```
    $ npm install -g node-inspector
    ```

#### Debugging

Now, you should start your node application with the following command in order to enter the debugging mode:

    ```
    $ node --debug yourApp.js
    ```

or, to pause your script on the first line:

    ```
    $ node --debug-brk yourApp.js
    ```

After you enable the debugging you should follow these steps:

* Start the inspector. I usually put it in the terminal (on the side to see the log massages)

    ```
    $ node-inspector &
    ```

* Open your Chrome and type this:

    ```
    http://127.0.0.1:8080/debug?port=5858
    ```

* You wanna make sure these ports are not blocked before step #1.
* You should see the customize DevTools in your tab. If you can’t see the javascript source from node just click the scripts tab. It would be a similar window to the picture below. Feel free to click on it in order to get the full size.
* Select a script and set some breakpoints (far left line numbers).
* Done! You can now debug your NodeJS application.

### Deploying on Amazon EC2
1. create an account on aws.amazon.com and set up two-factor authentication.
2. click on EC2 - Virtual Servers in the Cloud. (EC2 stands for "Elastic Compute Cloud.") In the left-hand nav, click on "Instances." From the next screen, click the button "Launch Instance." 
3. chose  Ubuntu 13.04 ami, but any relatively recent Linux flavor should work fine
4. create new ssh keys, and download them and move them from your Downloads folder to someplace more permanent:
   
   mv key_for_nodejs_demo_server.pm ~/.
5. restrict the permissions on your key_for_nodejs_demo_server.pem file so that only your user can access it — not anyone else on your computer.
   
   chmod -R 700 ~/.ssh/key_for_nodejs_demo_server.pem

6. ssh onto your server. Check the tick-box next to your server name. You should see your server name — something like ec2-75-101-178-88.compute-1.amazonaws.com. You'll need this name to ssh on

ssh -i ~/.ssh/key_for_nodejs_demo_server.pem ubuntu@ec2-75-101-178-88.compute-1.amazonaws.com

* you should see that your command prompt changed, indicating you're now on the EC2 server. You should see something like this:

ubuntu@ip-10-164-108-235:-$

7. install node.js

sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
node --version

8. install github so we can get the app from github
sudo apt-get install git

9. get the app (make sure u have a git account)

git clone https://github.com/leanometry/codecamp
 
10. build the app

cd ../client
npm install

sudo npm -g install grunt
 sudo npm install -g grunt-cli
 
grunt build

 cd ../server
 npm install
 
11. set the prod var for process.env.NODE_ENV
export NODE_ENV='production'

12. Change the port from 5000 to 8080. For security reasons, we're not going to allow any connections on ports below 1024.
     Now, in order to allow requests on the standard HTTP port, 80, let's set up some port forwarding.
      First, run this command to see if you have ip forwarding enabled already
    
    cat /proc/sys/net/ipv4/ip_forward
    
    * If it returns 0, then ip forwarding is disabled. A 1 means it's enabled.
    
    sudo pico /etc/sysctl.conf
    
    * In this file, uncomment this line:
    
    net.ipv4.ip_forward
    
    * This will enable ip forwarding. Then, to enable the changes made in sysctl.conf:
    
    sudo sysctl -p /etc/sysctl.conf
    
    * Now, let's check that ip forwarding is enabled:
    
    cat /proc/sys/net/ipv4/ip_forward
    
    * That should return a 1 now.
    
    * Now, let's set up forwarding from 80 to 8080:
    
    sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
    
    * Next, we need to open the Linux firewall to allow connections on port 80:
    
    sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
    sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT

 13. * We need a way to keep our Node.js application running even after we logout of our EC2 instance.
     For this, we'll use the Forever module by Nodejitsu, that was already added in package.json and installed with the other modules. 
     * file start allows starting the server and file stop allows stopping the server
     * content start file:
     
        --------
        #!/bin/bash
         
        # Invoke the Forever module (to START our Node.js server).
        ./node_modules/forever/bin/forever \
        start \
        -al forever.log \
        -ao out.log \
        -ae err.log \
        server.js
        ---------
        
      * content stop file:
      
        --------
         #!/bin/bash
          
         # Invoke the Forever module (to STOP our Node.js server).
         ./node_modules/forever/bin/forever stop server.js
        ---------
        
     * to run them they must be given permissions:
        chmod +x ./start
        chmod +x ./stop
        
     * execute the start bash script to start the server:
        ./start
        This will invoke the Forever module and start our Node.js server (server.js). It should output something like:
        
        info: Forever processing file: server.js
        
        You'll notice that calling Forever puts you back into the command-line
        
     * execute the stop bash script to stop the server:
        ./stop
         