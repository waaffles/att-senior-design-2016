/* File: index.js
 * The starting point of our routes, index.js acts as a "map" of all routes available to our server.
 */

/* resolve path to our static content */
var path = require('path');

/* Ensures a request is valid, otherwise redirects to login page */
var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
	//res.sendFile(path.resolve('views/login.html'));
};

/* This function serves two purposes.
 * Contains the route for the home page.
 * Also brings in the other routes available to the server
 */
module.exports = function(app, passport) {
	/* GET request to home page */
	app.get('/home', isAuthenticated,  function(req, res) {
		res.sendFile(path.resolve('views/index.html'));
	});

	var alert = require('./alerts')(app, isAuthenticated);
	var site = require('./sites')(app, isAuthenticated);
	var auth = require('./auth')(app, passport, isAuthenticated);
	var admin = require('./admins')(app, isAuthenticated);
	var swagger = require('./swagger')(app);
};
