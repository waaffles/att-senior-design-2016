var admin = require('../models/admin');
var path = require('path');

module.exports = function(app, isAuthenticated){
  var db = app.get('db');

  //function to check if user is admin
  var requiresAdmin = function() {
    return [
      isAuthenticated,
      function(req, res, next) {
        if (req.user && req.user.admin === true)
        next();
        else
        res.send(401, 'Unauthorized');
      }
    ]
  };

  //will check if user is admin for all routes that start with /admin
  app.all('/admin/*', requiresAdmin());

  //route to go to test page for testing admin users
  app.get('/admin/test', function(req, res) {
		res.sendFile(path.resolve('views/test.html'));
	});

  //All routes for admin must be of the form /admin/....
  //just like the test route above. If route does not start with /admin
  //it will not check if user is admin and give acess to any user.

  //post route that will allow admin user to update data type thresholds
  //example of json input:
  //data type to update ->{"type": "eff_freq",
 // "lowerDanger": 1} <- threshold to update for data type
  app.post('/admin/updateDataType', function(req, res){
    var dataUpdate = req.body;
    admin.updateDataType(db, dataUpdate).then(function (response){
        res.send(response)
    })
  });

  /* GET request to the swagger page*/
  app.get('/admin', function (req, res) {
    var views = app.get('views');
    res.sendFile('admin.html', { root : path.join(__dirname, '../views')});
        //res.sendFile('views/admin.html');
  });

};
