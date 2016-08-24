var csv = require("fast-csv");
var Promise = require('bluebird');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/*changed this to rfcc data. we should pick one now though
before everyone else starts inserting it*/
var url = 'mongodb://localhost:27017/rfcc_data';

mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('Connected to :' + url);
    console.time("inserting");

    return new Promise(function(reject, resolve) {
        return importType(db, function(){
            console.log('closing db');
        }).then(function() {
          return importSites(db, function() {
              console.log('closing db');
          });
        }).then(function() {
            return importTransponders(db, function() {
                console.log('closing db');
            });
        }).then(function() {
            return importData(db, function() {
                console.log('closing db');
		            console.timeEnd("inserting");
                return resolve();
            });
        });
    });
});

var importType = function(db, callback){
    var collection = db.collection('data_type');
    var docs = [
      {type:"esno", upperWarning:20, upperDanger:25.00, lowerWarning:10.00, lowerDanger:1},
      {type:"cnr", upperWarning:20, upperDanger:25.00, lowerWarning:10.00, lowerDanger:1},
      {type:"mer", upperWarning:20, upperDanger:25.00, lowerWarning:10.00, lowerDanger:1},
      {type:"power", upperWarning:null, upperDanger:-15, lowerWarning:null, lowerDanger:-70.00},
      {type:"eff_freq", upperWarning:null, upperDanger:null, lowerWarning:null, lowerDanger:null}
    ];
    collection.drop();
    return new Promise(function (resolve, reject) {
        collection.insert(docs, function (err, result) {
            assert.equal(err, null);
        });
        resolve(callback());
    });
};

var importSites = function(db, callback) {
    var collection = db.collection('sites');
    var i = 0;
    collection.drop();
    return new Promise(function (resolve, reject) {
	    var bulk = collection.initializeUnorderedBulkOp();
        csv
            .fromPath("tbl_rfcc_sites.csv")
            .on("data", function (data) {
                var doc = {};
                doc.site = data[0];
                doc.city = data[1];
                doc.state = data[2];
                doc.longitude = data[3];
                doc.latitude = data[4];
                bulk.insert(doc, function (err, result) {
                    assert.equal(err, null);
                });
            })
            .on("end", function () {
		            bulk.execute();
                resolve(callback());
            });
    });
};

var importTransponders = function(db, callback) {
    var collection = db.collection('transponders');
    var i = 0;
    collection.drop();
    return new Promise(function (resolve, reject){
	    var bulk = collection.initializeUnorderedBulkOp();
	    csv
		    .fromPath("tbl_rfcc_txps_shift.csv")
		    .on("data", function (data) {
                	var doc = {};
                	doc.txp_id = data[0].slice(5, data[0].length);
                	doc.satname = data[1];
                	doc.satcode = data[2];
                	doc.txp_num = data[3];
                	doc.polarization = data[4];
                	doc.tone = data[5];
                	doc.bbc = data[6];
                	doc.site = data[7];
                	doc.notes = data[8];
                	bulk.insert(doc, function (err, result) {
                	    assert.equal(err, null);
                	});
            	})
	    .on("end", function () {
        bulk.execute();
        resolve(callback());
	    });
    });
};


var importData = function(db, callback) {
    var collection = db.collection('main_data');
    var i = 0;
    collection.drop();
    return new Promise(function (resolve, reject){
	    var count = 0;
	    var bulk = collection.initializeUnorderedBulkOp();
        csv
            .fromPath("tbl_rfcc_data_shift.csv")
            .on("data", function(data){
		count++;
                var doc = {};
                doc.site = data[0];
                doc.txp_id = data[1].slice(5, data[1].length);
                doc.date_time = new Date(data[2]).toISOString();
                doc.mer = data[3];
                doc.power = data[4];
                doc.esno = data[5];
                doc.cnr = data[6];
                doc.eff_freq = data[7];
                doc.lock_counnt = data[8];
                doc.relock_count = data[9];
                bulk.insert(doc, function(err, result) {
                    assert.equal(err, null);
                });
		if (count % 1000 === 0){
			bulk.execute();
			bulk = collection.initializeUnorderedBulkOp();
		}
		if (count % 10000 === 0){
			console.log('Records: ' + count);
		}
            })
            .on("end", function(){
		bulk.execute();
                resolve(callback());
            });
    });
};
