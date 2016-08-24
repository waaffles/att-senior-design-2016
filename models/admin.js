/**
 * Admin model will hold our function to interact with the database
 * When current user is admin.
 * @module Admin
 */

/** The asmin variable is exported, and used as the instance of the admin model. */
var admin = exports = module.exports,
    /** Allows us access to the Promise module. Used to wrap functions in an asynchronous process
     * @requires bluebird
     */
    Promise = require('bluebird');

module.exports = {

  /** example of dataUpdate input:
   *{
   *    "type": "eff_freq",
   *    "upperWarning": 0,
   *    "upperDanger": 0,
   *    "lowerWarning": 0,
   *    "lowerDanger": 0
   *}
   */

  /** Update the threshold value for a data type
   * @param {MongoClient} db - Universal instance of the database used throughout the entire application
   * @param {Object} dataUpdate - A JSON object that will have the new threshold values of the data Type
   * @return {Array}
   */
  updateDataType: function(db, dataUpdate) {
      return new Promise(function (resolve, reject){
          var collection = db.get().collection('data_type');
          collection.update(
            // searches for specified data type in database
            {type: dataUpdate.type},
            // updates the document found with the values in the dataUpdate JSON object
            {$set: dataUpdate},
            function (err, res) {
                if (err) console.log(err);
                return resolve(res);
            });
        })
    }
};

return admin;
