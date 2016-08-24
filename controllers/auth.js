/* file: auth.js
 * auth.js handles our user authentication. Our 'strategies' for login, logout, & signup reside here.
 * All authentication routes here (except for logout) follow a basic structure:
 *   POST payload to route:
 *     On success: redirect to requested resource
 *     On failure: redirect to login or signup
 */

/* Path is required to resolve the path to our views and other static content */
var path = require('path');

module.exports = function(app, passport, isAuthenticated) {

	/* Signup
	 * Signup is comprised of two routes, GET and POST.
	 * When a client first requests the signup page (using GET), the server will respond with the signup page.
	 * Once a client fills out their information and presses submit, a POST request will be made to the server
	 * with a payload consisting of the username, email, and password.
	 *
	 * If signup is successful, redirect to login, otherwise stay on the page.
	 */

	app.get('/signup', function(req, res) {
		res.sendFile(path.resolve('views/signup.html'));
	});

	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup'
	}));

	/* login
	 * Login is comprised of two routes, GET and POST.
	 */

	/* Return login page upon GET request */
	app.get('/', function(req, res) {
		res.sendFile(path.resolve('views/login.html')); 
	});

	/* Return error login page upon GET request */
	app.get('/login_error', function(req, res) {
		res.sendFile(path.resolve('views/login_error.html')); 
	});


	/* Authenticate user, on success, redirect to home, otherwise stay on login page */
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/login_error'
	}));
	/*Log authenticated user out */
	app.post('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    app.get('/username', isAuthenticated, function(req, res) {
        res.json({username:req.user.username})
    })
};
