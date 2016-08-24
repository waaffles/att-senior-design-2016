var alert = require('../models/alert'),
    User = require('../models/user'),
    Promise = require('bluebird'),
    tempAlerts = require('../config/tempAlerts'),
    mailer = require('nodemailer'),
    senderAuth = require('../config/emailSender'),
    moment = require('moment');

var transporter = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: senderAuth.user,
            pass: senderAuth.pass
        }
    });

module.exports = function(app, isAuthenticated) {

    var db = app.get('db');

    // route to return all unresolved alerts
    app.get('/alerts/unresolved', isAuthenticated, function (req, res) {
        //res.send(tempAlerts.tempAlerts());
        alert.getUnresolvedAlerts(db).then(function (response) {
            res.send(response);
        });
    });

    // route to return all alerts regardless of whether resolved or not
    app.get('/alerts/all', isAuthenticated, function (req, res) {
        //res.send(tempAlerts.tempAlerts());
        alert.getAllAlerts(db).then(function (response) {
            res.send(response);
        });
    });

    //sample demo alert inserted to test getAlerts route
    app.get('/alerts/insertDemo', function (req, res) {
       console.log(req.body);
       alert.insertDemoAlert(db).then(function (response) {
           res.redirect('/home');
       });
    });

    //insert demo user for dev purposes
    //app.get('/alerts/demoUser', function (req, res) {
    //    var DemoUser = new User({
    //        username: 'waaffles3',
    //        password: 'choco123',
    //        email: 'davidariascg+1@gmail.com',
    //        alertable: true
    //    });
    //    DemoUser.save(function (err) {
    //        if (err) throw err;
    //        res.send('saved demo dude successfully')
    //    })
    //});

    // route to insert alerted that was detected upon data import
    app.post('/alerts/insert', function (req, res) {
        var alertBody = req.body.alert;

        alertBody['created_on'] = moment().format();
        alertBody['comment'] = null;
        alertBody['resolved'] = false;
        alertBody['resolved_by'] = null;
        alertBody['resolved_on'] = null;

        alert.insertAlert(db, alertBody).then(function (response) {
            return User.getAlertableUserEmails(db);
        }).then(function (emailList) {
            console.log(emailList);
            if (emailList.length > 0) {
                sendAlert(alertBody, emailList).then(function (response) {
                    if (response['success']) {
                        res.send('Email was sent succesffuly!!\n')
                    } else {
                        res.send('Unable to send email: \n');
                    }
                })
            }
            else {
                res.send('No users to be alerted!')
            }
        });
    });

    // calls when an alert continuous to show up on import, but values have changed, therefore needing
    // to update the current danger level and/or value of the alert
    // also gets called when dismissing the alert, since it's still essentially updating the alert and nothing else
    app.post('/alerts/update', isAuthenticated, function (req, res) {
        var alertUpdates = req.body.alertUpdates;

        if (alertUpdates['resolved']) {
            alertUpdates['resolved_by'] = req.user.username;
            alertUpdates['resolved_on'] = moment().format();
        }

        alert.updateAlert(db, alertUpdates).then(function (response){
            res.send(response)
        })
    });


    function sendAlert(sortedAlert, emailList) {
        var emailListStr = emailListConverter(emailList);

        var sendToList = emailListStr,
            site = sortedAlert['site'],
            transponder = sortedAlert['transponder'],
            dataType = sortedAlert['data_type'],
            currentValue = sortedAlert['current_value'],
            category = sortedAlert['category'];



        var alertText = '<h1>Alert generated for:</h1>' +
            '<br>     Site: ' + site +
            '<br>     Transponder: ' + transponder +   // plaintext body
            '<br>     Data Type: ' + dataType +
            '<br>     Current Value: ' + currentValue +
            '<br>     Category: ' + category;

        var mailOptions = {
            from: senderAuth.user,
            to: sendToList,
            subject: "ALERT GENERATED",
            generateTextFromHTML: true,
            html: alertText
        };
        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    return reject({
                        success: false,
                        error: error
                    });
                } else {
                    return resolve({
                        success: true,
                        result: response
                    });
                }
            });
        });
    }

    /// converts an array of emails in string format to one string of emails
    function emailListConverter(emailList) {
        var emailString = '';
        for (var array in emailList) {
            if (emailList.hasOwnProperty(array)) {
                emailString += (emailString === '') ? emailList[array]['email'] : ', ' + emailList[array]['email'];
            }
        }
        return emailString;
    }
};
