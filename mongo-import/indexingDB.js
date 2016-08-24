var csv = require("fast-csv");
var Promise = require('bluebird');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/rfcc_data';

mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('Connected to :' + url);
    console.time("indexing");

    return new Promise(function(reject, resolve){
        return siteIndex(db, function(){
              console.log("sites Indexing");

        }).then(function(){
          return transpondersIndex(db, function(){
              console.log("transponders Indexing");

          });
        }).then(function(){
          return main_dataIndex(db, function(){
              console.log("main_data Indexing");
              console.timeEnd("indexing");
              db.close();
              //return resolve();
          });
        });
    });
});

var siteIndex = function(db, callback){
    var collection = db.collection('sites');

    return new Promise(function(resolve, reject){
        collection.createIndex({"site": 1}, function (err, result) {
            if(result){
                assert.equal(err, null);
                resolve(callback());
            }
            else{
                console.log(err);
                reject(err);
            }

        });
    });
};

var transpondersIndex = function(db, callback){
    var collection = db.collection('transponders');
    return new Promise(function(resolve, reject){
        collection.createIndex({"site": 1, "satname": 1}, function (err, result) {
            if(result){
                assert.equal(err, null);
                resolve(callback());
            }
            else{
                console.log(err);
                reject(err);
            }
        });
    });
};

var main_dataIndex = function(db, callback){
    var collection = db.collection('main_data');
    return new Promise(function(resolve, reject){
        collection.createIndex({"site": 1, "txp_id": 1, "date_time": 1}, function (err, result) {
            if(result){
                assert.equal(err, null);
                resolve(callback());
            }
            else{
                console.log(err);
                reject(err);
            }
        });
    });
};
