// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var models       		= require('../model');
var User = models.User;
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.find({where: {id: id}})
			.success(function (user){
				done(null,user);
			}).error(function (err){
				done(err,null);
			});
	});

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password
		usernameField : 'username',
		passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

		// find a user whose username is the same as the forms username
		// we are checking to see if the user trying to login already exists
        User.find({where: {username: username}})
			.success(function (user) {
				// check to see if theres already a user with that username, can override with any field name that is to be used for login name
				if (user) {
					console.log('username already taken');
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
				} else {

					// if there is no user with that username
					// create the user
					var newUser = User.build({
						username: username,
						email: req.body.email,
						password: User.generateHash(password)
					});

					// save the user
					newUser.save()
						.success(function(justsaved){
							// console.log(JSON.stringify(justsaved));
							return done(null,justsaved);
						})
						.error(function(error){
							console.log(JSON.stringify(error));
							return done(err);
						});
					
				}

			}).error(function (err){    
				done(err);
			});

    }));
	
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, can override with any field name that is to be used for login name
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with username and password from our form
		console.log('check logging in with 'username+': '+password);
		// find a user whose username is the same as the forms username
		// we are checking to see if the user trying to login already exists
         //the return param position are to be processed in route.js
		 //(param1, param2, param3) : param1 is for error, 
		 //							  param2 false is for failed to logged in, user object is for successfully logged in
		 //							  param3 for flash return message (not tested)
		 User.find({where: {username: username}})
			.success(function (user) {
            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
			}
			// if the user is found but the password is wrong
            if (!user.checkPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Wrong password.')); // create the loginMessage and save it to session as flashdata
			}
            // all is well, return successful user
            return done(null, user);
            }).error(function (err){  
			// if there are any errors, return the error before anything else			
				done(err);
			});

    }));

};
