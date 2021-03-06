/**
 * Site model will hold our functions to interact with the database
 * And return the data. Minimal data manipulation is done in the model
 * @module Site
 */

    /** The site variable is exported, and used as the instance of the site model.*/
var site = exports = module.exports,
    /** Allows us access to the Promise module. Used to wrap functions in an asynchronous process
     * @requires bluebird
     */
    Promise = require('bluebird');

module.exports =  {
    /**
     * Returns the list of all the sites
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @return {Array}
     */
    getAllSites: function(db) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('sites');
            collection.find({}, {_id : 0}).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            })
        });
    },

    /**
     * Returns the list of all satellites related to the site that was used in the query
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @param {String} siteName - Name of the site you wish to gather satellites from
     * @return {Array}
     */
    getAllSatsPerSite: function(db, siteName) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('transponders');
            collection.aggregate(
                [
                    { $match: { site: siteName } },
                    { $group: { _id: "$satname" } },
                    { $sort: { _id : 1} }
                ]
            ).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            });
        });
    },

    /**
     * Returns the list of all transponders related to combination of a site and one of its satellites
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @param {String} siteName - Name of the site you wish to gather satellites from
     * @param {String} satName - Name of the satellite you wish to gather transponders from
     * @return {Array}
     */
    getAllTransPerSiteSat: function(db, siteName, satName) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('transponders');
            collection.aggregate(
                [
                    { $match: { site: siteName, satname: satName } },
                    { $group: { _id: { txp_num :"$txp_num", txp_id :"$txp_id"} } },
                    { $sort: { _id : 1} }
                ]
            ).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            });
        });
    },

    /*	SAMPLE QUERY
     db.availability_data.find({"site":MIMN, "date":{"$gte":"2012-05-01", "$lte":"2012-05-02"}})
     */

    /**
     * Returns the data points relevant to the combination of site, satellite, list of transponders given,
     * datatype, and date range
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @param {String} siteName - Name of the site you wish to gather satellites from
     * @param {Array} txpIds - An array of all the transponders you wish to query for data
     * @param {String} dataType - The type of data you wish to check against
     * @param {Date} date1 - The beginning date of the date range you wish to query
     * @param {Date} date2 - The ending date of the date range you wish to query
     * @return {Array}
     */
    getDataBetweenDates: function(db, siteName, txpIds, dataType, date1, date2) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('main_data'),
                dataTypeAndDate = {};

            // Allows to dynamically change which dataType we're looking for in the collection
            dataTypeAndDate[dataType] = '$' + dataType;
            dataTypeAndDate['date_time'] = '$date_time';

            collection.aggregate(
                [
                    // searches for our specified parameters
                    { $match: { site: siteName, txp_id: { $in: txpIds }, date_time: { $gte :date1, $lte :date2 } } },
                    // Finds the data and groups it by site and transponder, along with all the data we need to pull
                    {
                        $group: {
                            _id: { site: "$site", txp_id :"$txp_id" },
                            trans_data: { $addToSet: dataTypeAndDate }
                        }
                    },
                    // The grouped data, isn't sorted. Must be broken down, sorted, and pasted back together
                    { $unwind: "$trans_data" },
                    { $sort: { "trans_data.date_time": 1 } },
                    // One final grouping to get the data formatted properly
                    {
                        $group: {
                            _id: { trans_id: "$_id.txp_id" },
                            trans_data: { $push: "$trans_data"}
                        }
                    }
                ]
            ).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            });
        });
    },

    /**
     * Returns a list of all the data types saved in the database
     * @param {MongoClient} db - Universal instance of the database used throughout the entire application
     * @return {Array}
     */
    getDataTypes: function(db) {
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('data_type');
            collection.find({}).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            })
        });
    },

    getThresholds: function(db, dataType){
        return new Promise(function (resolve, reject) {
            var collection = db.get().collection('data_type');
            collection.find({type: dataType}, {_id: 0}).toArray(function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            })
        });
    }
};

return site;