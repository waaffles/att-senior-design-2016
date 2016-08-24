var login = require('./login');
var User = require('../models/user');
var signup = require('./signup');
//Using: http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
module.exports = function(passport){
	passport.serializeUser(function(user, done) {
		console.log('serializing user: ');
		console.log(user);
		done(null, user._id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user: ', user);
			done(err, user);
		});
	});

	login(passport);
	signup(passport);
};
