//Import all of our dependencies
var express = require('express'),
    db = require('./config/db'),
    mongoose = require('mongoose'),
    bodyParser = require( 'body-parser'),
    passport = require('passport'),
    expressSession = require('express-session'),
    initPassport = require('./passport/init'),
    swagger = require('swagger-node-express'),
    argv = require('minimist')(process.argv.slice(2));

var app = express(),
    port = process.env.PORT || 3000,
    domain = process.env.DOMAIN || 'localhost',
    url = 'mongodb://localhost:27017/rfcc_data';

// Parse urlencoded post data
app.use( bodyParser.urlencoded({ extended: true }) );

// Parse raw json post data
app.use( bodyParser.json() );

// Set our default directory to get static content.
app.use( express.static('./public') );

app.use('/swagger', express.static('./swagger'));

// Set the db instance as a property of app.
// the db variable will now follow app through any functions
app.set( 'db', db );
mongoose.connect( url );

// NOTE: FOR debugging purposes only, not for use in production.
// Set the json spacing to 2, in order to read json response from server
app.set('json spaces', 2);

// Passport is authentication middleware for node.js
// We use this to provide user login as well as admin functions for selected users
// http://passportjs.org
app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));

//initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

initPassport(passport);

// Requiring the controllers folder does two things.
// First, it looks for a file named index.js.
// Once found, it uses that file as a map, to load all other routes referenced.
// App & passport must be passed as variables, to append the routes to app and allow for authentication.
require('./controllers')(app, passport);

// // Set api-doc path
// swagger.configureSwaggerPaths('', 'api-docs', '');
//
// // Set application URL
// var applicationUrl = 'http://' + domain + ':' + port + '/swagger';
// swagger.configure(applicationUrl, '1.0.0');

// Before the application can begin to listen on our predetermined port, we must make sure mongoDB is available.
// Our startup process works as follows:
// Attempt to connect to db:
//   Success: Begin server, listen on predetermined port.
//   Failure: Error out, "Unable to connect"
db.connect(url, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        app.listen(port, function (err, res) {
            console.log('server and mongo started on port: %s', port);
        });
    }
});

// Set process title for debugging
process.title = 'vlad:mir';

// Set
// swagger.setApiInfo({
//     title: "Vladmir API",
//     description: "API to allow connectivity to the Mongo Database to retrieve and manipulate RFCC Data",
//     termsOfServiceUrl: "",
//     contact: "",
//     license: "",
//     licenseUrl: ""
// });
