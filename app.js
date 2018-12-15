var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs'); // used to hash the password

var config = require('./config'); // this is requiring the folder config because our app.js file is on the root folder. Once required, it will find the index.js and run it, giving us the configuration
var requireIfExists = require('./app_modules/requireIfExists.js') // this is to get fallback function for require,
var localConfigValues = requireIfExists('../config/localConfig'); // if localConfig file found get it. Otherwise return null.This is to get congif values if in local environment. otherwise use process.env variables
var setupController = require('./controllers/setupController');
var apiController = require('./controllers/apiController');
var htmlController = require('./controllers/htmlController');
var usersController = require('./controllers/usersController');

app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// express session
app.use(session({
    name: 'myAppSession',
    secret: process.env.SECRET || localConfigValues.secret,
    saveUninitialized: false,
    resave: false
}));

// passport inti
app.use(passport.initialize());
app.use(passport.session());

// Express Validator -- may be deprecated
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// connect flash
app.use(flash());

// global variables for our flash messages. we use 'res.locas' when we wnat to create a global variable or function
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // we have this in addition to error_msg because passport is setting its own flash messages
    res.locals.user = req.user || null; // if there is a user (logged in) we can access it anywhere (e.g. in layout). otherwise it's null/ req.user will be set after deserializeUser and if deserializing returns user data
    next();
});

// connect to mogoDb
mongoose.connect(config.getDbConnectionString(), { useNewUrlParser: true });

setupController(app);
apiController(app);
htmlController(app);
usersController(app);

app.listen(port);

/*
Functionalities to build server side:

done - allow creation of toDos for another user
done - allow to specify for which user we wnat to render the toDos
done - cannot create duplicate users

deply on heroku
*/
