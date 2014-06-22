// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT;
var pg 		 = require('pg').native;
var passport = require('passport');
var flash 	 = require('connect-flash');
var cors	 = require('./app/config/cors');

var connectionString = process.env.DATABASE_URL;
var client = new pg.Client(connectionString);

// configuration ===============================================================
//client.connect(); // connect to our database

require('./app/config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	// required for passport
	app.use(express.session({ secret: 'trekntrackbyunknownparkfornwen304' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(cors); //set response header for CORS

});

// routes ======================================================================
require('./app/route.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port, function() {
  console.log('Listening on:', port);
});

