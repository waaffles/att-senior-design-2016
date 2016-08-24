/**
* User model will hold our function to interact with the database
* And return user data from the database.
* @module User
*/


var mongoose = require('mongoose'),
   /** Allows us access to the Promise module. Used to wrap functions in an asynchronous process
    * @requires bluebird
    */
    Promise = require('bluebird');
var Schema = mongoose.Schema;


var exports = module.exports = {};

    /** This variable will define the schema for users in the database */
var UserSchema = new Schema({
	username: String,
	password: String,
	email: String,
    alertable: {type:Boolean, default: true},
    admin: {type:Boolean, default: false} //can change to true to make user admin
}, {collection: 'users'});

/**
 * Returns a list of emails from users who can be alerted
 * @param {MongoClient} db - Universal instance of the database used throughout the entire application
 * @return {Array}
 */
UserSchema.statics.getAlertableUserEmails = function (db) {
    return new Promise(function (resolve, reject) {
        var collection = db.get().collection('users');
        collection.find({ alertable: true }, {email:1, _id:0}).toArray(function (err, res) {
            if (err) console.log(err);
            return resolve(res);
        })
    })
};

/**
 * Returns a list of users in database
 * @param {MongoClient} db - Universal instance of the database used throughout the entire application
 * @return {Array}
 */
UserSchema.statics.getUsers = function(db) {
    return new Promise(function (resolve, reject) {
        var collection = db.get().collection('users');
        collection.find().toArray(function (err, res) {
            if (err) console.log(err);
            return resolve(res);
        })
    })
};

var User = mongoose.model('User', UserSchema);

return module.exports = User;
