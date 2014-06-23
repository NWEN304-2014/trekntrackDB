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
        // by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.find({where: {email: email}})
			.success(function (user) {
				// check to see if theres already a user with that email
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser = User.build({
						name: req.body.name,
						email: email,
						password: User.generateHash(password)
					});


					// save the user
					newUser.save()
						.success(function(justsaved){
							return done(null,justsaved);
						})
						.error(function(error){
							return done(err);
						});
					// newUser.save(function(err) {
						// if (err)
							// return done(err);
						// return done(null, newUser);
					// });
				}

			}).error(function (err){    
				done(err);
			});

    }));
	
};

