/**
 * Alert model will hold our function to interact with the database
 * To insert, update, and retrieve alerts.
 * @module Alert
 */


var moment = require('moment'),
    /** Allows us access to the Promise module. Used to wrap functions in an asynchronous process
     * @requires bluebird
     */
    Promise = require('bluebird');

    /** The alert variable is exported, and used as the instance of the alert module. */
var alert = exports = module.exports = {};

/** Things to receive are: Transponder, currentValue, category, */

module.exports = {


    insertDemoAlert: function(db) {
        var alerts = [
            {
                site: 'LACA',
                sat: 'SC1',
                transponder: 'TXP-02',
                data_type: 'esno',
                threshold: 3.2,
                current_value: 3.0,
                category: 'warning',
                comment: null,
                resolved: false,
                resolved_by: false,
                created_on: moment().format(),
                resolved_on: null
            },
            {
                site: 'PAKY',
                sat: 'SC1',
                transponder: 'TXP-02',
                data_type: 'esno',
                threshold: 3.2,
                current_value: 2.6,
                category: 'danger',
                comment: null,
                resolved: false,
                resolved_by: false,
                created_on: moment().format(),
                resolved_on: null
            },
            {
                site: 'NATN',
                sat: 'SC10',
                transponder: 'TXP-20',
                data_type: 'esno',
                threshold: 3.2,
                current_value: 1.9,
                category: 'danger',
                comment: null,
                resolved: false,
                resolved_by: false,
                created_on: moment().format(),
                resolved_on: null
            },
            {
                site: 'KCMO',
                sat: 'SC10',
                transponder: 'TXP-17',
                data_type: 'esno',
                threshold: 3.2,
                current_value: 0.7,
                category: 'warning',
                comment: null,
                resolved: false,
                resolved_by: false,
                created_on: moment().format(),
                resolved_on: null
            },
            {
                site: 'AUGA',
                sat: 'SC3',
                transponder: 'TXP-02',
                data_type: 'esno',
                threshold: 3.2,
                current_value: 1.2,
                category: 'danger',
                comment: null,
                resolved: false,
                resolved_by: false,
                created_on: moment().format(),
                resolved_on: null
            }
        ];


       return new Promise(function (resolve, reject) {
           var collection = db.get().collection('alerts');
           collection.insertMany(alerts, function (err, res) {
               if (err) throw err;
               return resolve(res['ops'][0]);
           })
       });

    },

    /**
     * Insert an alert into the database
     * @param {MondoClient} db - Universal instance of the database used throughout the entire application
     * @param {Object} alert - A JSON object representing an alert
     * @return {Array}
     */
    insertAlert: function(db, alert) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('alerts');
            collection.insert(alert, function (err, res) {
                if (err) console.log(err);
                return resolve(res['ops'][0]);
            })
        });
    },

    /**
     * Return a list of all the alerts that have not been resolved
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @return {array}
     */
    getUnresolvedAlerts: function(db) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('alerts');
            collection.find({ resolved: false }).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            })
        })
    },

    /**
     * Return a list of all the alerts
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @return {array}
     */
    getAllAlerts: function(db) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('alerts');
            collection.find({}).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            })
        })
    },

    /**
     * Update an alert
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @param {Object} alertUpdates - JSON object with new values to update an alert 
     * @return {array}
     */
    updateAlert: function(db, alertUpdates) {
        return new Promise(function (resolve, reject) {
            var ObjectId = require('mongodb').ObjectID;

            var collection = db.get().collection('alerts'),
                id = new ObjectId(alertUpdates['_id']);

            delete alertUpdates['_id'];

            collection.updateOne(
                { _id: id},
                { $set: alertUpdates },
                function (err, res) {
                    if (err) console.log(err);
                    return resolve(res);
                }
            );
        })
    }
};

return alert;
