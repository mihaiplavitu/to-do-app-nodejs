var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var owasp = require('owasp-password-strength-test'); // module to test password strength

module.exports = function(app) {

    // post register user
    app.post('/users/register', function(req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var password2 = req.body.password2;

        // validation using expressValidator library
        req.checkBody('name', 'name is required').notEmpty();
        req.checkBody('email', 'email is required').notEmpty();
        req.checkBody('email', 'email is invalid').isEmail();
        req.checkBody('username', 'username is required').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();
        var owaspResults = owasp.test(req.body.password); // use owasp module to check if the password is strong
        req.checkBody('password2', 'passwords do not match').equals(req.body.password);

        var errors; // set variable to handle possible errors
        if (req.validationErrors() || owaspResults.errors.length > 0) { // check if any errors have been found
            errors = req.validationErrors() || []; // set errors as array to be sent to the view for handleing client side errors
            for (errIndex = 0; errIndex < owaspResults.errors.length; errIndex++) {
                errors.push({ msg: owaspResults.errors[errIndex] }); // we push owaspResults.errors to errors array (if any)
            };
        } else {
            errors = false; // set errors to null if no errors were fond
        };

        if(errors) {
            console.log(errors)
            res.render('register', { errors: errors }); // if there are errors, we render the rehsiter page (like refresh) and pass along an object containing the errors which will be used in the 'register' view to print them - see 'register page for if statment'
        } else {
            var newUser = new User({ // we a new user using the model form /models/user.js
                name: name,
                email: email,
                username: username,
                password: password
            });

            // now we create, hash the password and save the user using the function from our user.js fiel in models/user.js
            User.createUser(newUser, function(err, user) {
                // if (err) throw err;
                if (err) {
                    var errors = []; // set array to be sent to the view for passing error messages to client side
                    console.log('user creation errors: ' + err); // show err in server console
                    if (err.name === 'MongoError' && err.code === 11000) { // check if err is because of dupe username (code 11000 is returned by MongoDb meaning there is a dupe key)
                        errors.push({ msg: 'Username or Email Address already registered.' });
                    } else {
                        errors.push ({ msg: 'There was an error.'})
                    };
                    res.render('register', { errors: errors }); // if there are errors, we render the register page (like refresh) and pass along an object containing the errors which will be used in the 'register' view to print them - see 'register page for if statment'
                } else {
                    console.log('user creared: \n' + user);
                    // create a success messages
                    req.flash('success_msg', 'You are registered'); // we are using the global variable 'success_msg' which was setup in app.js for flash. We use this global variable in the layout to display messages
                    // and then we redirect
                    res.redirect('/users/login');
                };
            });
            /*
            // create a success messages
            req.flash('success_msg', 'You are registered'); // we are using the global variable 'success_msg' which was setup in app.js for flash. We use this global variable in the layout to display messages
            // and then we redirect
            res.redirect('/users/login');
            */
        };
    });

    passport.use(new LocalStrategy (
        function(username, password, done) {
            User.getUserByUsername(username, function(err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {message: 'unknown user'});
                };

                User.comparePassword(password, user.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'invalid password'});
                    };
                })
            })
        }
    ));

    passport.serializeUser(function(user, done) {
        //console.log('serializing user:' + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.getUserById(id, function(err, user) { // getUserById is a function we defined in our model user.js. it's quring the database to find user data by id and returns the result in a callback's paramter named user. Finally done(err, user) below is attaching the user data to req.user in order to be available anywhere in the app
          //console.log('deserializing user id:' + id);
          //console.log('user data found after deserializing is: ' + user);
          done(err, user);
      });
    });

    // post request to login

    app.post('/users/login',
        passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    );

    // logout
    app.get('/users/logout', function(req, res) {
        req.logout();
        req.flash('success_msg', 'You have been logged out');

        res.redirect('/users/login');
    });
};
