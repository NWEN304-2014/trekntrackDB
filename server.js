// server.js

// set up ======================================================================
// get all the tools we need
var flash 	 = require('connect-flash');
var express  = require('express');
var app      = express();
var port     = process.env.PORT;
var pg 		 = require('pg').native;
var passport = require('passport');

var cors	 = require('./app/config/cors');
var db		 = require('./app/model');
// var http	 = require('http');

var connectionString = process.env.DATABASE_URL;
var client = new pg.Client(connectionString);

// configuration ===============================================================
//client.connect(); // connect to our database

require('./app/config/passport')(passport); // pass passport for configuration

app.configure(function() {
	
	app.set('port',port);
	app.use(express.static(__dirname));
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.json());
	app.use(express.urlencoded()); // get information from html forms
	
	// app.use(express.methodOverride());
	
	
	// required for passport
	app.use(express.session({ secret: 'trekntrackbyunknownparkfornwen304' })); // session secret
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(app.router); //make REST invocation to get files

	

});


// routes ======================================================================
require('./app/route.js')(app, passport); // load our routes and pass in our app and fully configured passport

//enable cross-domain-sharing
app.all('*',function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	next();
});

// launch ======================================================================
//after successfully creating database, start the express server
db.sequelize.sync({force:true}).complete(function(err) {
  if (err) {
    throw err[0];
  } else {
    //seed database
	var user = db.User.build({ username: 'admin', email: 'admin', password: db.User.generateHash('admin')});
	//start server
    app.listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
});

