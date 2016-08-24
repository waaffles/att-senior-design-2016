var site = require('../models/site'),
    moment = require('moment'),             // module used to manipulate dates
    path = require('path');

module.exports = function(app, isAuthenticated) {
    var db = app.get('db');

    // Returns all sites
    app.get('/sites', isAuthenticated, function(req, res) {
        site.getAllSites(db).then(function (results){
            res.send(results);
        });
    });

    // returns all satellites related to a site
    // example url: localhost:3000/sites/NATN/sats
    app.get('/sites/:siteName/sats', isAuthenticated, function(req, res) {
        var siteName = req.params.siteName;
        site.getAllSatsPerSite(db, siteName).then(function (results){
            res.send(results);
            //res.send(site.getAllSatsPerSite(db, siteName));
        });
    });

    // returns all transponders related to a given site and one of its satellites
    // example url: localhost:3000/sites/NATN/XCRAFT1/trans
    app.get('/sites/:siteName/:satName/trans', isAuthenticated, function(req, res) {
        var siteName = req.params.siteName,
            satName = req.params.satName;
        site.getAllTransPerSiteSat(db, siteName, satName).then(function (results){
            res.send(results);
        });
    });

    // returns a specified data type given a site, trans, dataType, and date range (includes presets
    // if given custom dates, example url:
    // http://localhost:3000/sites/SCUT/trans?txpId=f989&txpId=f1105&txpId=f1339SCUT&dataType=esno&date1=2010-09-19&date2=2011-12-20
    // if given preset date, example url:
    // example url: http://localhost:3000/sites/SCUT/trans?txpId=f989&txpId=f1105&txpId=f1339SCUT&dataType=esno&range=week
    app.get('/sites/:siteName/trans', isAuthenticated, function(req, res) {
        var siteName = req.params.siteName,
            txpIds = req.query.txpId,
            dataType = req.query.dataType,
            date1,
            date2;

        // if custom dates given, do if statement
        // if given preset, go to else statement, take current date and subtract accordingly
        if (req.query.range == null) {
            date1 = req.query.date1;
            date2 = req.query.date2;
        } else {
            var range = req.query.range,
                currentDate = moment().format('YYYY-MM-DD');

            // only date1 (starting date) needs to be manipulated
            switch (range) {
                case 'week':
                    date1 = moment(currentDate).subtract(7, 'days').format('YYYY-MM-DD');
                    break;
                case 'month':
                    date1 = moment(currentDate).subtract(1, 'month').format('YYYY-MM-DD');
                    break;
                case 'halfyear':
                    date1 = moment(currentDate).subtract(6, 'month').format('YYYY-MM-DD');
                    break;
                case 'year':
                    date1 = moment(currentDate).subtract(1, 'year').format('YYYY-MM-DD');
                    break;
                default:
                    return;
            }
            // date2 will always be the current date
            date2 = currentDate;
        }

        // when inputting the dates, it only queries UP to the 2nd date. With this addition, it will be inclusive
        date1 = new Date(date1).toISOString();
        date2 = new Date(date2).toISOString();

        site.getDataBetweenDates(db, siteName, txpIds, dataType, date1, date2).then(function (results) {
            res.send(results);
        });

    });

    var newPath = { root : path.join(__dirname, '../views') };

    app.get('/datatypes/get', isAuthenticated, function(req, res) {
        site.getDataTypes(db).then(function (results) {
            res.send(results);
        });
    });

    app.get('/reports', isAuthenticated, function(req, res) {
        var views = app.get('views');
        res.sendFile('reports.html', newPath);
    });

    app.get('/archive', isAuthenticated, function(req, res) {
        var views = app.get('views');
        res.sendFile('archive.html', newPath);
    });

    app.get('/grapher', isAuthenticated, function(req, res) {
        var views = app.get('views');
        res.sendFile('grapher.html', newPath);
    });

    app.get('/reportPDF', isAuthenticated, function(req, res) {
        console.log(req.query.lengthtime);
        var views = app.get('views');

        res.sendFile('report_pdf.html', newPath);
    });

    app.get('/thresholds/:dataType', isAuthenticated, function(req, res){
        var type = req.params.dataType;
        site.getThresholds(db, type).then(function(results){
            res.send(results);
        });
    });
}
