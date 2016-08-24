var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
//Created using: http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
module.exports = function(passport){

	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		console.log(username);
		User.findOne(
			{'username': username},
			function(err, user) {
				if (err)
					return done(err);
				if (!user){
					console.log('User not found');
					return done(null, false);
				}
				if (!isValidPassword(user, password)){
					console.log('Invalid Password');
					return done(null, false);
				}

				return done(null, user);
			}
		);
	}));

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
};
