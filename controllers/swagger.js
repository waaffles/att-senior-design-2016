
module.exports = function(app, isAuthenticated) {

    /* GET request to the swagger page*/
    app.get('/swagger', function (req, res) {
        res.sendFile('/index.html');
    });

};