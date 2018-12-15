var bodyParser = require('body-parser');

module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', ensureAuthenticated, function(req, res) {
        res.render('index');
    });

    // render registration page
    app.get('/users/register', function(req, res) {
        res.render('register', { errors: [] }); // we rneder a view that's called register
    });

    // render login page
    app.get('/users/login', function(req, res) {
        res.render('login')
    });

    // protect webpages with authentication. We call this funcion in the get request for pages we want to be accessed only by authenticated users
    function ensureAuthenticated (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'You are not logged in');
            res.redirect('users/login');
        };
    };

};
